const express = require("express");
const { subCategoryControllers, addsubCategoryControllers, deletesubCategoryControllers } = require("../../../controllers/subcategoryControllers");
const { TokenCheckMiddleware, adminCheckMiddleware } = require("../../../utils/authMiddleware");


const router = express.Router();

router.post("/addsubcategory", TokenCheckMiddleware , adminCheckMiddleware ,addsubCategoryControllers );


router.delete("/deletesubcategory/:id", TokenCheckMiddleware, adminCheckMiddleware, deletesubCategoryControllers );

router.patch("/updatesubcategory/:id", TokenCheckMiddleware, adminCheckMiddleware, subCategoryControllers );

module.exports = router;
