const express = require("express");
const path = require("path");

const { addbannerControllers, deletebannerControllers, updatebannerControllers, getallbannerControllers} = require("../../../controllers/bannerControllers");
const { TokenCheckMiddleware, adminCheckMiddleware } = require("../../../utils/authMiddleware");
const upload = require("../../../utils/multer.img.upload");
const bannerModel = require("../../../model/banner.model");

const router = express.Router();




// Add Banner Route
router.post("/addbanner", TokenCheckMiddleware, adminCheckMiddleware, upload.single("banner"), addbannerControllers);

// Delete Banner Route
router.delete("/deletebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, deletebannerControllers); 

// Update Banner Route

router.patch("/updatebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, upload.single("banner"), updatebannerControllers )

// Get All Banner Route
router.get("/getallbanner", getallbannerControllers );

module.exports = router;
