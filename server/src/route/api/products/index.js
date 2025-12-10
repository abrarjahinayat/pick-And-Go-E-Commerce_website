const express = require("express");
const { addproductControllers, getallproductControllers, getleastproductControllers, deleteproductControllers, getproductbyslugControllers } = require("../../../controllers/addproductControllers");
const upload = require("../../../utils/multer.img.upload");
const router = express.Router();


router.post("/addproduct", upload.array("product"),addproductControllers );

router.get("/allproducts", getallproductControllers );
router.get("/leastproduct", getleastproductControllers );
router.delete("/deleteproduct/:id", deleteproductControllers);
router.get("/productslug/:slug", getproductbyslugControllers );

module.exports = router;
