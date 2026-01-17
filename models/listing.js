const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  // Multiple images support
  images: [{
    url: String,
    filename: String,
  }],
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats"
    ],
    default: "Trending"
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  // Amenities
  amenities: [{
    type: String,
    enum: [
      "WiFi",
      "AC",
      "TV",
      "Kitchen",
      "Washer",
      "Parking",
      "Pool",
      "Hot Tub",
      "Gym",
      "BBQ",
      "Fireplace",
      "Balcony",
      "Garden",
      "Beach Access",
      "Ski Access",
      "Pet Friendly",
      "Smoking Allowed",
      "Workspace",
      "First Aid Kit",
      "Fire Extinguisher"
    ]
  }],
});

// Virtual to get all images (combines primary image with additional images)
listingSchema.virtual("allImages").get(function () {
  const all = [];
  if (this.image && this.image.url) {
    all.push(this.image);
  }
  if (this.images && this.images.length > 0) {
    all.push(...this.images);
  }
  return all;
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;