const express = require("express");
const {
  addproductControllers,
  getallproductControllers,
  getleastproductControllers,
  deleteproductControllers,
  getproductbyslugControllers,
  getmenproductsControllers,
  getwomenproductsControllers,
  getkidsproductsControllers,
  getProductsByCategory,
  featuredproductsControllers,
  getProductsByCategoryAndSubCategory,
  getSimilarProductsControllers,
  getCategoryPoloControllers,
  getCategoryKurtiTopsControllers,
  getCategoryPanjabiControllers,
  getCategoryCargoDenimsControllers,
  accessoriesproductsControllers,
  getpremiumsockesControllers,
  getallmencategoryControllers,
} = require("../../../controllers/addproductControllers");
const upload = require("../../../utils/multer.img.upload");
const router = express.Router();

router.post("/addproduct", upload.array("product"), addproductControllers);

router.get("/allproducts", getallproductControllers);
router.get("/leastproduct", getleastproductControllers);
router.delete("/deleteproduct/:id", deleteproductControllers);
router.get("/productslug/:slug", getproductbyslugControllers);
router.get("/menproducts", getmenproductsControllers);
router.get("/womenproducts", getwomenproductsControllers);
router.get("/kidsproducts", getkidsproductsControllers);
router.get("/accessoriesproducts", accessoriesproductsControllers );
router.get("/category/:slug", getProductsByCategory);
router.get(
  "/category/:categorySlug/:subcategorySlug",
  getProductsByCategoryAndSubCategory
);
router.get("/featuredproducts", featuredproductsControllers);
router.get("/similarproducts/:slug", getSimilarProductsControllers);
router.get("/categorypolo/:slug", getCategoryPoloControllers );
router.get("/categorykurtitops/:slug", getCategoryKurtiTopsControllers );
router.get("/categorypanjabi/:slug", getCategoryPanjabiControllers );
router.get("/categorycargodenims/:slug", getCategoryCargoDenimsControllers  );
router.get("/categorypremiumsockes/:slug", getpremiumsockesControllers  );
router.get("/allmencategory", getallmencategoryControllers );
module.exports = router;
