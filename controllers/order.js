const Order = require('../schemas/orders');

exports.postOrder = async (req, res, next) => {
    const { productName, productCount, userID } = req.body;
    // const { user } = res.locals;
    try {
        await Order.create({
            orderStatus: '주문접수',
            userID,
            // userID: user.userID,
        });

        for (let i = 0; i < productName.length; i++) {
            await Order.findOneAndUpdate(
                { userID: userID },
                {
                    $push: {
                        productName: { name: productName[i] },
                        productCount: { count: productCount[i] },
                    },
                    // userID: user.userID,
                }
            );
        }
        res.status(200).json({
            result: true,
            msg: '상품 주문이 완료되었습니다.',
        });
        // console.log(`${user.userID}님의 상품 주문이 접수되었습니다.`);
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 등록에 실패했습니다.',
        });
        next(error);
    }
};

exports.modifyOrder = async (req, res, next) => {
    const { productName, productCount } = req.body;
    console.log(req.body);
    // const { user } = res.locals;
    try {
        for (let i = 0; i < productName.length; i++) {
            await Order.findOneAndUpdate(
                { _id: req.params.orderId },
                {
                    $set: { productCount: { count: productCount[0] } },
                }
            );
            await Order.findOneAndUpdate(
                { _id: req.params.orderId },
                {
                    $push: { productCount: { count: productCount[i] } },
                }
            );
        }

        for (let i = 0; i < productName.length; i++) {
            if (productCount[i] === 0) {
                await Order.findOneAndUpdate(
                    { _id: req.params.orderId },
                    {
                        $pull: {
                            productName: { name: productName[i] },
                            productCount: { count: 0 },
                        },
                    }
                );
            }
        }

        res.status(200).json({
            result: true,
            msg: '주문이 수정되었습니다.',
        });
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '주문 수정에 실패했습니다.',
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
