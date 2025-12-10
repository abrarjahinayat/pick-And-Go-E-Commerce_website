const express = require('express');
const router = express.Router();
const auth = require('./auth');
const banner = require('./banner');
const category = require('./category');
const subcategory = require('./subcategory');
const products = require('./products');
const variant = require('./varient');
const coupon = require('./coupon');
const cart = require('./cart');
const order = require('./order');

router.use('/auth', auth);
router.use('/banner', banner);
router.use('/category', category);
router.use('/subcategory', subcategory);
router.use('/products', products);
router.use('/variant', variant);
router.use('/coupon', coupon);
router.use('/cart', cart);
router.use('/order', order);

module.exports = router;