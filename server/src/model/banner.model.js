const { default: mongoose } = require("mongoose");
const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "image is required"],
    },
    link:{
        type: String,
        required: [true, "link is required"],
    }
   
  },
  { timestamps: true }
);





module.exports = mongoose.model("Banner", bannerSchema);
