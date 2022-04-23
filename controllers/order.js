const Order = require('../schemas/orders');

exports.postOrder = async (req, res, next) => {
    const { product, orderStatus } = req.body;
    // const { user } = res.locals;
    try {
        await Order.create({
            product,
            orderStatus,
            // userID: user.userID,
        });
        res.status(200).json({
            result: true,
            msg: '상품 주문이 완료되었습니다.',
        });
        // console.log(`${user.userID}님의 상품 주문이 있습니다.`);
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 등록에 실패했습니다.',
        });
        next(error);
    }
};

exports.modifyOrder = async (req, res, next) => {
    const { product, orderStatus } = req.body;
    // const { user } = res.locals;
    try {
        await Order.findByIdAndUpdate(req.params.orderId, {
            $set: { product, orderStatus },
        });
        res.status(200).json({
            result: true,
            msg: '상품이 수정되었습니다.',
        });
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 수정에 실패했습니다.',
        });
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    // const { user } = res.locals;
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.status(200).json({
            result: true,
            msg: '상품이 삭제되었습니다.',
        });
        // console.log(`${user.userID}님의 상품 주문이 취소되었습니다.`);
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 삭제에 실패했습니다.',
        });
        next(error);
    }
};
