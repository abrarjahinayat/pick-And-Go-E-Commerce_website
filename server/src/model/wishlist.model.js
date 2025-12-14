const { default: mongoose } = require("mongoose");
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
    },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
