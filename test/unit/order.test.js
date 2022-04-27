const httpMocks = require('node-mocks-http');
const orderController = require('../../controllers/order');
const Order = require('../../schemas/orders');
const locals = require('../data/locals.json');
const isOrderPost = require('../data/isOrderPost.json');
const isOrderModify = require('../data/isOrderModify.json');

Order.create = jest.fn();
Order.findOneAndUpdate = jest.fn();
Order.findByIdAndUpdate = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.locals.user = locals;
    req.params.orderId = jest.fn();
});

describe('상품 주문', () => {
    test('상품 주문 성공', async () => {
        req.body = isOrderPost;
        await orderController.postOrder(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '상품 주문이 완료되었습니다.',
        });
    });
    test('상품 주문 실패', async () => {
        Order.create = jest.fn().mockRejectedValue(new Error());
        await orderController.postOrder(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '상품 주문에 실패했습니다.',
        });
    });
});

describe('주문 수정', () => {
    test('상품 수정 성공', async () => {
        req.body = isOrderModify;
        await orderController.modifyOrder(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '주문이 수정되었습니다.',
        });
    });
    test('상품 수정 실패', async () => {
        Order.create = jest.fn().mockRejectedValue(new Error());
        await orderController.postOrder(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '상품 주문에 실패했습니다.',
        });
    });
});

describe('주문 삭제', () => {
    test('주문 삭제 성공', async () => {
        await orderController.cancelOrder(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '주문이 취소되었습니다.',
        });
    });
    test('주문 삭제 실패', async () => {
        Order.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error());
        await orderController.cancelOrder(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '예기치 못한 오류가 발생했습니다. 다시 시도해주세요.',
        });
    });
});
