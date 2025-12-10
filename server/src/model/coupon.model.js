const { default: mongoose } = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    minPrice: {
      type: String,
      required: true,
    },
    amout: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
