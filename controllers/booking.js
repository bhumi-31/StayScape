const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;

    // Parse dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.redirect(`/listings/${id}`);
    }

    if (checkInDate < new Date().setHours(0, 0, 0, 0)) {
        req.flash("error", "Check-in date cannot be in the past");
        return res.redirect(`/listings/${id}`);
    }

    // Start a session for transaction (optimistic locking)
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Get listing details
        const listing = await Listing.findById(id).session(session);
        if (!listing) {
            await session.abortTransaction();
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Check if user is trying to book their own listing
        if (listing.owner.equals(req.user._id)) {
            await session.abortTransaction();
            req.flash("error", "You cannot book your own listing");
            return res.redirect(`/listings/${id}`);
        }

        // Check for date conflicts (locking mechanism)
        const hasConflict = await Booking.hasConflict(id, checkInDate, checkOutDate);
        if (hasConflict) {
            await session.abortTransaction();
            req.flash("error", "Sorry, these dates are already booked. Please select different dates.");
            return res.redirect(`/listings/${id}`);
        }

        // Calculate total price
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = listing.price * nights;

        // Create booking with version for optimistic locking
        const booking = new Booking({
            listing: id,
            guest: req.user._id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests || 1,
            totalPrice: totalPrice,
            status: "confirmed",
            version: 0
        });

        await booking.save({ session });
        await session.commitTransaction();

        req.flash("success", `Booking confirmed! Your stay from ${checkInDate.toLocaleDateString()} to ${checkOutDate.toLocaleDateString()} is confirmed.`);
        res.redirect("/bookings");

    } catch (error) {
        await session.abortTransaction();
        console.error("Booking error:", error);
        req.flash("error", "Failed to create booking. Please try again.");
        res.redirect(`/listings/${id}`);
    } finally {
        session.endSession();
    }
};

module.exports.getUserBookings = async (req, res) => {
    const bookings = await Booking.find({ guest: req.user._id })
        .populate({
            path: "listing",
            populate: { path: "owner" }
        })
        .sort({ createdAt: -1 });

    res.render("users/bookings.ejs", { bookings });
};

module.exports.getHostBookings = async (req, res) => {
    // Get all listings owned by the user
    const listings = await Listing.find({ owner: req.user._id });
    const listingIds = listings.map(l => l._id);

    // Get all bookings for those listings
    const bookings = await Booking.find({ listing: { $in: listingIds } })
        .populate("listing")
        .populate("guest")
        .sort({ createdAt: -1 });

    res.render("users/hostBookings.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/bookings");
    }

    // Check if user owns this booking
    if (!booking.guest.equals(req.user._id)) {
        req.flash("error", "You can only cancel your own bookings");
        return res.redirect("/bookings");
    }

    // Check if booking is in the future
    if (booking.checkIn < new Date()) {
        req.flash("error", "Cannot cancel a booking that has already started");
        return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully");
    res.redirect("/bookings");
};

module.exports.getBookedDates = async (req, res) => {
    const { id } = req.params;
    const bookedDates = await Booking.getBookedDates(id);
    res.json(bookedDates);
};
