const { default: mongoose } = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "image is required"],
    },
    name:{
        type: String,
        required: [true, "name is required"],
        unique: true,
    },
    slug: {
      type: String,
    },
    subcategory: [{ type: mongoose.Types.ObjectId, ref: "SubCategory" }],
   
  },
  { timestamps: true }
);





module.exports = mongoose.model("Category", categorySchema);
