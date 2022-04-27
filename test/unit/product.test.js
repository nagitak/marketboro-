const httpMocks = require('node-mocks-http');
const productController = require('../../controllers/product');
const Product = require('../../schemas/products');
const User = require('../../schemas/users');
const locals = require('../data/locals.json');
const isProductPost = require('../data/isProductPost.json');
const isProductModify = require('../data/isProductModify.json');

Product.create = jest.fn();
User.findOne = jest.fn();
Product.findByIdAndUpdate = jest.fn();
Product.findByIdAndDelete = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.locals.user = locals;
    req.params.productId = jest.fn();
});

describe('상품 등록', () => {
    test('상품 등록 성공', async () => {
        req.body = isProductPost;
        await productController.postProduct(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '상품이 등록되었습니다.',
        });
    });
    test('상품 등록 실패', async () => {
        Product.create = jest.fn().mockRejectedValue(new Error());
        await productController.postProduct(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '상품 등록에 실패했습니다.',
        });
    });
});

describe('상품 수정', () => {
    test('상품 수정 성공', async () => {
        req.body = isProductModify;
        await productController.modifyProduct(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '상품이 수정되었습니다.',
        });
    });
    test('상품 수정 실패', async () => {
        Product.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error());
        await productController.modifyProduct(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '상품 수정에 실패했습니다.',
        });
    });
});
describe('상품 삭제', () => {
    test('상품 삭제 성공', async () => {
        await productController.deleteProduct(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '상품이 삭제되었습니다.',
        });
    });
    test('상품 삭제 실패', async () => {
        Product.findByIdAndDelete = jest.fn().mockRejectedValue(new Error());
        await productController.deleteProduct(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '상품 삭제에 실패했습니다.',
        });
    });
});
