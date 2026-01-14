const express = require("express");
const path = require("path");


const upload = require("../../../utils/multer.img.upload");
const { addfeatureimgControllers, getallfeatureimgControllers, getnextThreefeatureimgControllers, getnextsixfeatureimgControllers, getaccessoriesfeatureimgControllers, getkidsfeatureimgControllers } = require("../../../controllers/featureimgControllers");


const router = express.Router();




// Add Banner Route
router.post("/addfeatureimg", upload.single("featureimg"), addfeatureimgControllers );

// Get Frist 6 Banner Route
router.get("/getallfeatureimg", getallfeatureimgControllers );

// Get 2nd- 3 Banner Route
router.get("/getnextThreefeatureimg", getnextThreefeatureimgControllers );

// Get 3rd- 6 Banner Route
router.get("/getnextsixfeatureimg", getnextsixfeatureimgControllers );

// Get Accessories Banner Route

router.get("/getaccessoriesfeatureimg", getaccessoriesfeatureimgControllers );

// Get kids banner Route

router.get("/getkidsfeatureimg", getkidsfeatureimgControllers  );


// Delete Banner Route
// router.delete("/deletebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, deletebannerControllers); 

// // Update Banner Route

// router.patch("/updatebanner/:id", TokenCheckMiddleware, adminCheckMiddleware, upload.single("banner"), updatebannerControllers )


module.exports = router;
