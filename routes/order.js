const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');

router.post('/order/post', orderController.postOrder);
router.patch('/order/modify/:orderId', orderController.modifyOrder);
router.delete('/product/delete/:orderId', orderController.deleteOrder);

module.exports = router;
