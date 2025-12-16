const express = require("express");
const path = require("path");


const upload = require("../../../utils/multer.img.upload");
const { addfeatureimgControllers, getallfeatureimgControllers } = require("../../../controllers/featureimgControllers");


const router = express.Router();




// Add Banner Route
router.post("/addfeatureimg", upload.single("featureimg"), addfeatureimgControllers );

// Delete Banner Route
// router.delete("/deletebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, deletebannerControllers); 

// // Update Banner Route

// router.patch("/updatebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, upload.single("banner"), updatebannerControllers )

// Get All Banner Route
router.get("/getallfeatureimg", getallfeatureimgControllers );

module.exports = router;
