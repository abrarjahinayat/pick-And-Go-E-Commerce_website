const { default: mongoose } = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
    },
    image: [
      {
        type: String,
        required: [true, "image is required"],
      },
    ],
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    price: {
      type: Number,
    },
    originalPrice:{
      type: Number,

    },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    discountprice: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
    },
    reviews: [
      {
        type: String,
      },
    ],
    variantType: {
      type: String,
      enum: ["SingleVarient", "MultiVarient"],
      default: "none",
    },

    variants: [{ type: mongoose.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
 