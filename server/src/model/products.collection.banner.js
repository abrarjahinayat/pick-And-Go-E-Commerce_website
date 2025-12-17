const { default: mongoose } = require("mongoose");
const productCollectionBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "image is required"],
    },
    link:{
        type: String,
        required: [true, "link is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
     category: {
    type: mongoose.Types.ObjectId,
    ref: "Category"
  },
    isActive: {
    type: Boolean,
    default: true
  }
   
  },
  { timestamps: true }
);





module.exports = mongoose.model("productCollectionBanner", productCollectionBannerSchema);
