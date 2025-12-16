const { default: mongoose } = require("mongoose");
const featureimgSchema = new mongoose.Schema(
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
   
  },
  { timestamps: true }
);





module.exports = mongoose.model("FeatureImg", featureimgSchema);
