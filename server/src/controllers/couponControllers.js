const couponModel = require("../model/coupon.model");


const createCouponControllers = async (req, res) => {

    try {
        let { code,  minPrice, amout } = req.body;

        // Check if coupon code already exists
        const existingCoupon = await couponModel.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({message: "Coupon code already exists"});
        }

        const newCoupon = new couponModel({ code, minPrice, amout });
        await newCoupon.save();

        return res.status(201).json({ success: true, message: "Coupon created successfully", data: newCoupon});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
    }


};

const applyCouponControllers = async (req, res) => {

    try {
        let { code } = req.body;

        const coupon = await couponModel.findOne({ code });
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid coupon code"});
        }

        return res.status(200).json({ success: true, message: "Coupon applied successfully", data: coupon});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
    }

};

const deleteCouponControllers = async (req, res) => {
    try {

        const { id } = req.params;
        const deletedCoupon = await couponModel.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found"});
        }

        return res.status(200).json({ success: true, message: "Coupon deleted successfully"});
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
    }
};

module.exports = {
  createCouponControllers,
  applyCouponControllers,
  deleteCouponControllers,
};