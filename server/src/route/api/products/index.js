const express = require("express");
const { addproductControllers, getallproductControllers, getleastproductControllers, deleteproductControllers, getproductbyslugControllers, getmenproductsControllers, getwomenproductsControllers, getkidsproductsControllers, getProductsByCategory, featuredproductsControllers } = require("../../../controllers/addproductControllers");
const upload = require("../../../utils/multer.img.upload");
const router = express.Router();


router.post("/addproduct", upload.array("product"),addproductControllers );

router.get("/allproducts", getallproductControllers );
router.get("/leastproduct", getleastproductControllers );
router.delete("/deleteproduct/:id", deleteproductControllers);
router.get("/productslug/:slug", getproductbyslugControllers );
router.get("/menproducts", getmenproductsControllers );
router.get("/womenproducts",  getwomenproductsControllers );
router.get("/kidsproducts",  getkidsproductsControllers );
router.get("/accessoriesproducts",  getwomenproductsControllers );
router.get("/category/:slug", getProductsByCategory);
router.get("/featuredproducts", featuredproductsControllers )



module.exports = router;
