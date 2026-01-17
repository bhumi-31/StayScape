const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// Create a booking
router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));

// Get user's bookings
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.getUserBookings));

// Get host's incoming bookings
router.get("/bookings/hosting", isLoggedIn, wrapAsync(bookingController.getHostBookings));

// Cancel a booking
router.delete("/bookings/:id", isLoggedIn, wrapAsync(bookingController.cancelBooking));

// Get booked dates for a listing (API endpoint)
router.get("/api/listings/:id/booked-dates", wrapAsync(bookingController.getBookedDates));

module.exports = router;
