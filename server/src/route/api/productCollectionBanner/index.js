const express = require("express");
const path = require("path");


const upload = require("../../../utils/multer.img.upload");
const { addproductCollectionBanner, getdesignerpoloBanner, getkurtitopsBanner, getpanjabiBanner, getcargodenimsBanner, getlittleonesteesBanner, getpremiumsockesBanner, getwomenproductsBanner } = require("../../../controllers/productCollectionBannerControllers");



const router = express.Router();




// Add Product Collection Banner Route
router.post("/addproductCollectionBanner", upload.single("productbanner"), addproductCollectionBanner  );

// get designer polo banner route

router.get("/getdesignerpolobanner", getdesignerpoloBanner  );

// get kurtiTops banner route

router.get("/getkurtitopsbanner", getkurtitopsBanner  );

// get panjabi banner route

router.get("/getpanjabibanner", getpanjabiBanner  );

// Get Cargo Denims Banner Route

router.get("/getcargodenimsbanner", getcargodenimsBanner  );

// Little Ones Tees
router.get("/getlittleonesteesbanner", getlittleonesteesBanner   );

// Preimum Sockes

router.get("/getpremiumsockesbanner", getpremiumsockesBanner    );

// women products banner route
router.get("/getwomenproductsbanner", getwomenproductsBanner    );


module.exports = router;
