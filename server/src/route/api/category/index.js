const express = require("express");
const path = require("path");
const { TokenCheckMiddleware, adminCheckMiddleware } = require("../../../utils/authMiddleware");
const upload = require("../../../utils/multer.img.upload");
const { addcategoryControllers, deletecategoryControllers, getallcategoryControllers, updatecategoryControllers } = require("../../../controllers/categoryControllers");

const router = express.Router();


// Add Category Route
router.post("/addcategory", TokenCheckMiddleware, adminCheckMiddleware, upload.single("category"), addcategoryControllers);

// Delete Category Route
router.delete("/deletecategory/:id", TokenCheckMiddleware, adminCheckMiddleware, deletecategoryControllers );

router.put("/updatecategory/:id", TokenCheckMiddleware, adminCheckMiddleware, upload.single("category"), updatecategoryControllers);


// Get All Category Route1
router.get("/getallcategory",  getallcategoryControllers);


module.exports = router;
