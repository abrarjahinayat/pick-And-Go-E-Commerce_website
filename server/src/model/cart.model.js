const { default: mongoose } = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    variants: {
      type: mongoose.Types.ObjectId,
      ref: "Variant",
    },
    totalPrice: {
      type: Number,
    },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
