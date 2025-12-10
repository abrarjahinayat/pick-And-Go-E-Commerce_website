const express = require('express');
const router = express.Router();
const api = require('./api');

// api route

router.use(process.env.BASE_URL,api)

console.log("Route is working");
 
module.exports = router;