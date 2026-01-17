const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayScape!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to StayScape!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};

// Wishlist Controller Functions
module.exports.renderWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.render("users/wishlist.ejs", { wishlistListings: user.wishlist });
};

module.exports.toggleWishlist = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const isInWishlist = user.wishlist.includes(id);

    if (isInWishlist) {
        // Remove from wishlist
        user.wishlist.pull(id);
        await user.save();
        res.json({ success: true, action: "removed", message: "Removed from wishlist" });
    } else {
        // Add to wishlist
        user.wishlist.push(id);
        await user.save();
        res.json({ success: true, action: "added", message: "Added to wishlist" });
    }
};

// Profile Controller Function
module.exports.renderProfile = async (req, res) => {
    const { username } = req.params;

    // Find the user
    const profileUser = await User.findOne({ username }).populate("wishlist");

    if (!profileUser) {
        req.flash("error", "User not found");
        return res.redirect("/listings");
    }

    // Get user's listings
    const userListings = await Listing.find({ owner: profileUser._id });

    // Get user's reviews
    const userReviews = await Review.find({ author: profileUser._id })
        .populate({
            path: "author",
            select: "username"
        });

    // Get reviews with their listing info (need to find listings containing these reviews)
    const listingsWithUserReviews = await Listing.find({ reviews: { $in: userReviews.map(r => r._id) } })
        .populate({
            path: "reviews",
            match: { author: profileUser._id },
            populate: { path: "author" }
        });

    // Get user's bookings (only if viewing own profile)
    let userBookings = [];
    if (req.user && req.user._id.equals(profileUser._id)) {
        userBookings = await Booking.find({ guest: profileUser._id })
            .populate("listing")
            .sort({ createdAt: -1 })
            .limit(5);
    }

    // Check if viewing own profile
    const isOwnProfile = req.user && req.user._id.equals(profileUser._id);

    res.render("users/profile.ejs", {
        profileUser,
        userListings,
        listingsWithUserReviews,
        userBookings,
        isOwnProfile
    });
};