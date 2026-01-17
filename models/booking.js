const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "confirmed"
    },
    version: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient date conflict queries
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ status: 1 });

// Virtual for number of nights
bookingSchema.virtual("nights").get(function () {
    const diffTime = this.checkOut - this.checkIn;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to check date conflicts
bookingSchema.statics.hasConflict = async function (listingId, checkIn, checkOut, excludeBookingId = null) {
    const query = {
        listing: listingId,
        status: { $nin: ["cancelled"] },
        $or: [
            // New booking starts during existing booking
            { checkIn: { $lte: checkIn }, checkOut: { $gt: checkIn } },
            // New booking ends during existing booking
            { checkIn: { $lt: checkOut }, checkOut: { $gte: checkOut } },
            // New booking completely contains existing booking
            { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } }
        ]
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const conflict = await this.findOne(query);
    return !!conflict;
};

// Static method to get booked dates for a listing
bookingSchema.statics.getBookedDates = async function (listingId) {
    const bookings = await this.find({
        listing: listingId,
        status: { $nin: ["cancelled"] },
        checkOut: { $gte: new Date() }
    }).select("checkIn checkOut");

    return bookings;
};

module.exports = mongoose.model("Booking", bookingSchema);
