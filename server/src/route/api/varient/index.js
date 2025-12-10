const express = require("express");
const { addvarientControllers } = require("../../../controllers/addvarientControllers");
const router = express.Router();


router.post("/addvariant", addvarientControllers )


module.exports = router;
