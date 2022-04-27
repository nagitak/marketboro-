const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const orderController = require('../controllers/order');

router.post('/order/post', auth, orderController.postOrder);
router.patch('/order/modify/:orderId', auth, orderController.modifyOrder);
router.put('/order/cancel/:orderId', auth, orderController.cancelOrder);

module.exports = router;
