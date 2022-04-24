const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.post('/product/post', productController.postProduct);
router.patch('/product/modify/:productId', productController.modifyProduct);

module.exports = router;
