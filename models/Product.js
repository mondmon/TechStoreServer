const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    maxlength: [50, "Product title can not be more than 50 characters"]
  },
  company: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "google",
      "samsung",
      "htc",
      "samsung",
      "fuji",
      "canon",
      "nikon",
      "acer",
      "hp",
      "lenovo",
      "dell"
    ]
  },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  photo: {
    type: String,
    default: "no-photo.jpg"
  },
  featured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"]
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"]
  }
});

module.exports = mongoose.model("Product", ProductSchema);
