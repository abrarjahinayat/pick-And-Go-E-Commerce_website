const express = require("express");
const { ordereControllers, getallordersControllers, odersuccessControllers, orderfailControllers, ordercancelControllers, getSingleorderControllers,  } = require("../../../controllers/orderControllers");

const router = express.Router();

router.post("/createorder", ordereControllers );

router.get("/getallorders", getallordersControllers );

router.post("/success/:id", odersuccessControllers );

router.post("/fail/:id", orderfailControllers );

router.post("/cancel", ordercancelControllers );

router.get("/singleorder/:id", getSingleorderControllers  );

module.exports = router;
