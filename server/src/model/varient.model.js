const { default: mongoose } = require("mongoose");
const variantSchema = new mongoose.Schema(
  {
    product:{
        type: mongoose.Types.ObjectId,
        ref: "Products"
    },
    size:{
        type: String,
        
    },
    color:{
        type: String,
    },
    stock: {
        type: Number,
    },
   
   
  },
  { timestamps: true }
);





module.exports = mongoose.model("Variant", variantSchema);
