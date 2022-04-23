const Product = require('../schemas/products');

exports.postProduct = async (req, res, next) => {
    const { name, price } = req.body;
    const { user } = res.locals;
    try {
        await Product.create({
            name,
            price,
            // userID: user.userID,
        });
        res.status(200).json({
            result: true,
            msg: '상품이 등록되었습니다.',
        });
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 등록에 실패했습니다.',
        });
        next(error);
    }
};

exports.modifyProduct = async (req, res, next) => {
    const { name, price } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.productId, {
            $set: { name, price },
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

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({
            result: true,
            msg: '상품이 삭제되었습니다.',
        });
    } catch (error) {
        res.status(400).json({
            result: false,
            msg: '상품 삭제에 실패했습니다.',
        });
        next(error);
    }
};
