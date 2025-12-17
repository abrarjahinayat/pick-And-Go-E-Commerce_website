const express = require("express");
const path = require("path");


const upload = require("../../../utils/multer.img.upload");
const { addproductCollectionBanner, getdesignerpoloBanner, getkurtitopsBanner } = require("../../../controllers/productCollectionBannerControllers");



const router = express.Router();




// Add Product Collection Banner Route
router.post("/addproductCollectionBanner", upload.single("productbanner"), addproductCollectionBanner  );

// get designer polo banner route

router.get("/getdesignerpolobanner", getdesignerpoloBanner  );

// get kurtiTops banner route

router.get("/getkurtitopsbanner", getkurtitopsBanner  );


module.exports = router;
