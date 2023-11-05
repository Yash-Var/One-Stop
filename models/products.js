const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 50,
    },
    cloudinaryImageId: {
      type: String,
      required: [true, "Please provide cloudinaryImageId"],
      maxlength: 50,
    },
    locality: {
      type: String,
      required: [true, "Please provide locality"],
      maxlength: 100,
    },
    areaName: {
      type: String,
      required: [true, "Please provide areaName"],
      maxlength: 100,
    },
    cuisines: [
      {
        type: String,
        required: [true, "Please provide cuisines"],
        maxlength: 100,
      },
    ],
    avgRating: {
      type: Number,
      required: [true, "Please provide avgRating"],
      maxlength: 3,
    },
    products: {
      type: [
        {
          name: {
            type: String,
            required: [true, "Please provide product name"],
            maxlength: 50,
          },
          price: {
            type: Number,
            required: [true, "Please provide product price"],
          },
          description: {
            type: String,
            required: [true, "Please provide product description"],
            maxlength: 300,
          },
          cloudinaryImageId: {
            type: String,
            required: [true, "Please provide cloudinaryImageId"],
            maxlength: 50,
          },
        },
      ],
      validate: {
        validator: function (array) {
          // Custom validator function to check if the array has at least one element
          return array.length > 0;
        },
        message: "At least one product is required.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
