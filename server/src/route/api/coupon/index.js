const express = require("express");
const { createCouponControllers, applyCouponControllers, deleteCouponControllers } = require("../../../controllers/couponControllers");
const router = express.Router();

router.post("/createCoupon", createCouponControllers );
router.post("/applyCoupons", applyCouponControllers);
router.delete("/deleteCoupon/:id", deleteCouponControllers );

module.exports = router;
