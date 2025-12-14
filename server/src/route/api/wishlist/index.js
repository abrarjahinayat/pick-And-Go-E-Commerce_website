const express = require("express");
const { addtowishlistControllers, getwishlistControllers, deletewishlistControllers, removewishlistControllers } = require("../../../controllers/wishlistControllers");


const router = express.Router();

router.post("/addtowishlist", addtowishlistControllers  );
router.get("/getwishlist/:id", getwishlistControllers );
router.delete("/deletewishlist/:id", deletewishlistControllers );
router.delete("/removewishlist/:id", removewishlistControllers );

module.exports = router;
