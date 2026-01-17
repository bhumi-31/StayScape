const Listing = require("../models/listing.js");
const mbxTilesets = require('@mapbox/mapbox-sdk/services/geocoding');


const mapToken = process.env.MAP_TOKEN;
console.log('Render Debug - MAP_TOKEN exists:', !!mapToken);
console.log('Render Debug - MAP_TOKEN first 10 chars:', mapToken ? mapToken.substring(0, 10) : 'undefined');
const geocodingClient = mbxTilesets({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// };

module.exports.index = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const category = req.query.category;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const location = req.query.location;

        let filters = {};

        // Search query filter (title or location)
        if (searchQuery) {
            filters.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { location: { $regex: searchQuery, $options: "i" } },
                { country: { $regex: searchQuery, $options: "i" } }
            ];
        }

        // Category filter
        if (category) {
            filters.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) {
                filters.price.$gte = parseInt(minPrice);
            }
            if (maxPrice) {
                filters.price.$lte = parseInt(maxPrice);
            }
        }

        // Location filter (searches in location and country)
        if (location) {
            if (!filters.$or) {
                filters.$or = [
                    { location: { $regex: location, $options: "i" } },
                    { country: { $regex: location, $options: "i" } }
                ];
            }
        }

        const listings = await Listing.find(filters);

        res.render("listings/index.ejs", {
            listings,
            searchQuery,
            category,
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            locationFilter: location || ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong!");
    }
};


module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};

// Map View - Show all listings on map
module.exports.mapView = async (req, res) => {
    const allListings = await Listing.find({}).select('title location country price image geometry category');

    // Convert to GeoJSON format for Mapbox
    const geoData = {
        type: "FeatureCollection",
        features: allListings.map(listing => ({
            type: "Feature",
            geometry: listing.geometry,
            properties: {
                id: listing._id,
                title: listing.title,
                location: listing.location,
                country: listing.country,
                price: listing.price,
                image: listing.image.url,
                category: listing.category
            }
        }))
    };

    res.render("listings/map.ejs", {
        geoData: JSON.stringify(geoData),
        mapToken: process.env.MAP_TOKEN.trim(),
        listingsCount: allListings.length
    });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    console.log('Controller Debug - MAP_TOKEN:', process.env.MAP_TOKEN ? 'EXISTS' : 'UNDEFINED');
    console.log('Controller Debug - MAP_TOKEN first 10 chars:', process.env.MAP_TOKEN ? process.env.MAP_TOKEN.substring(0, 10) : 'UNDEFINED');
    res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN.trim() });
};

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();

    console.log(req.body.listing);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    // Handle multiple images
    if (req.files && req.files.length > 0) {
        // First image is the primary image
        newListing.image = {
            url: req.files[0].path,
            filename: req.files[0].filename
        };
        // Additional images go to images array
        if (req.files.length > 1) {
            newListing.images = req.files.slice(1).map(file => ({
                url: file.path,
                filename: file.filename
            }));
        }
    }

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Handle multiple images upload
    if (req.files && req.files.length > 0) {
        // Add new images to existing images array
        const newImages = req.files.map(file => ({
            url: file.path,
            filename: file.filename
        }));

        // If no primary image exists, set first uploaded as primary
        if (!listing.image || !listing.image.url) {
            listing.image = newImages[0];
            if (newImages.length > 1) {
                listing.images = listing.images ? [...listing.images, ...newImages.slice(1)] : newImages.slice(1);
            }
        } else {
            // Add all new images to images array
            listing.images = listing.images ? [...listing.images, ...newImages] : newImages;
        }
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};