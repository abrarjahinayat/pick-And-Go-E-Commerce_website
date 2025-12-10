const express = require("express");
const { addtocartControllers, getcartControllers, getSinglecartControllers, updatecartControllers, deletecartControllers } = require("../../../controllers/cartControllers");
const router = express.Router();

router.post("/addtocart", addtocartControllers );

router.get("/getallcart" , getcartControllers);

router.get("/singlecart/:id" , getSinglecartControllers );

router.patch("/updatecart/:id", updatecartControllers);

router.delete("/deletecart/:id", deletecartControllers );


module.exports = router;
