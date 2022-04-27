const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const productController = require('../controllers/product');

router.post('/product/post', auth, productController.postProduct);
router.patch(
    '/product/modify/:productId',
    auth,
    productController.modifyProduct
);
router.delete(
    '/product/delete/:productId',
    auth,
    productController.deleteProduct
);

module.exports = router;
