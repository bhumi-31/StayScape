const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn, upload.array('listing[images]', 5), validateListing, wrapAsync(listingController.createListing)); // create route with multiple images

//New ROUTE

router.get("/new", isLoggedIn, listingController.renderNewForm);

// Map View Route
router.get("/map", wrapAsync(listingController.mapView));





//EDIT ROUTE

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// SHOW + UPDATE + DELETE

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // show route
    .put(isLoggedIn, isOwner, upload.array('listing[images]', 5), validateListing, wrapAsync(listingController.updateListing)) //update route with multiple images
    .delete(isOwner, wrapAsync(listingController.destroyListing)); // delete route




module.exports = router;