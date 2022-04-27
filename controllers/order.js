const Order = require('../schemas/orders');

exports.postOrder = async (req, res) => {
    const { productName, productCount } = req.body;
    const { user } = res.locals;
    try {
        await Order.create({
            orderStatus: '주문접수',
            userID: user.userID,
        });

        for (let i = 0; i < productName.length; i++) {
            await Order.findOneAndUpdate(
                { userID: user.userID },
                {
                    $push: {
                        productName: { name: productName[i] },
                        productCount: { count: productCount[i] },
                    },
                    userID: user.userID,
                }
            );
        }
        res.status(200).json({
            result: true,
            msg: '상품 주문이 완료되었습니다.',
        });
        console.log(`${user.userID}님의 상품 주문이 접수되었습니다.`);
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 주문에 실패했습니다.',
        });
    }
};

exports.modifyOrder = async (req, res) => {
    // 주문변경 시 $set 연산자를 사용해 기존 Array를 입력값의 첫번째 인덱스로 변경 후
    // for문과 $push 연산자를 이용해 모든 인덱스 값을 입력값으로 변경합니다.
    // 그 다음, for문을 이용해 인덱스를 돌면서 0이 발견되면 $pull 연산자를 이용하여 제거합니다.
    const { productName, productCount } = req.body;
    const { user } = res.locals;
    try {
        await Order.findByIdAndUpdate(req.params.orderId, {
            $set: { productCount: { count: productCount[0] } },
        });
        for (let i = 1; i < productName.length; i++) {
            await Order.findByIdAndUpdate(req.params.orderId, {
                $push: { productCount: { count: productCount[i] } },
            });
        }
        for (let i = 1; i < productName.length; i++) {
            if (productCount[i] === 0) {
                await Order.findByIdAndUpdate(req.params.orderId, {
                    $pull: {
                        productName: { name: productName[i] },
                        productCount: { count: 0 },
                    },
                });
            }
        }

        res.status(200).json({
            result: true,
            msg: '주문이 수정되었습니다.',
        });
        console.log(`${user.userID}님의 상품 주문이 수정되었습니다.`);
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '주문 수정에 실패했습니다.',
        });
    }
};

exports.cancelOrder = async (req, res) => {
    const { user } = res.locals;
    try {
        await Order.findByIdAndUpdate(req.params.orderId, {
            $set: {
                productName: { name: 'Cancel' },
                productCount: { count: 'Cancel' },
                orderStatus: '주문취소',
                userID: user.userID,
            },
        });
        res.status(200).json({
            result: true,
            msg: '주문이 취소되었습니다.',
        });
        console.log(`${user.userID}님의 상품 주문이 취소되었습니다.`);
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '예기치 못한 오류가 발생했습니다. 다시 시도해주세요.',
        });
    }
};
