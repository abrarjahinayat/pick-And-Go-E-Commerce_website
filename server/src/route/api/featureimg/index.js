const express = require("express");
const path = require("path");


const upload = require("../../../utils/multer.img.upload");
const { addfeatureimgControllers, getallfeatureimgControllers, getnextThreefeatureimgControllers } = require("../../../controllers/featureimgControllers");


const router = express.Router();




// Add Banner Route
router.post("/addfeatureimg", upload.single("featureimg"), addfeatureimgControllers );

// Get Frist 6 Banner Route
router.get("/getallfeatureimg", getallfeatureimgControllers );

// Get Next 3 Banner Route
router.get("/getnextThreefeatureimg", getnextThreefeatureimgControllers );

// Delete Banner Route
// router.delete("/deletebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, deletebannerControllers); 

// // Update Banner Route

// router.patch("/updatebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, upload.single("banner"), updatebannerControllers )


module.exports = router;
