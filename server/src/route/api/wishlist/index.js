const express = require("express");
const { addtowishlistControllers, getwishlistControllers, deletewishlistControllers, removewishlistControllers, getsinglewishlistControllers } = require("../../../controllers/wishlistControllers");


const router = express.Router();

router.post("/addtowishlist", addtowishlistControllers  );
router.get("/getwishlist/:id", getwishlistControllers );
router.delete("/deletewishlist/:id", deletewishlistControllers );
router.delete("/removewishlist/:id", removewishlistControllers );
router.get("/getsinglewishlist/:id", getsinglewishlistControllers );

module.exports = router;
