const httpMocks = require('node-mocks-http');
const userController = require('../../controllers/user');
const User = require('../../schemas/users');
const locals = require('../data/locals.json');
const signup1 = require('../data/signup1.json');
const signup2 = require('../data/signup2.json');
const signup3 = require('../data/signup3.json');
const signup4 = require('../data/signup4.json');
const signup5 = require('../data/signup5.json');
const signup6 = require('../data/signup6.json');
const signup7 = require('../data/signup7.json');
const signup8 = require('../data/signup8.json');
const wrongPW = require('../data/wrongPW.json');
const isUser = require('../data/isUser.json');
const isPW = require('../data/isPW.json');
const PWUpdateOne = require('../data/PWupdateOne.json');
const wrongPWUpdateOne1 = require('../data/wrongPWUpdateOne1.json');
const wrongPWUpdateOne2 = require('../data/wrongPWUpdateOne2.json');

User.findOne = jest.fn();
User.create = jest.fn();
User.updateOne = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.locals.user = locals;
});

describe('회원가입', () => {
    test('회원가입 가능할 때', async () => {
        req.body = signup4;
        User.create.mockResolvedValue(signup5);
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '회원가입이 완료되었습니다.',
        });
    });
    test('PW와 confirmPW 다른 경우 에러 발생!', async () => {
        req.body = signup1;
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '비밀번호가 다르게 입력되었습니다.',
        });
    });
    test('이미 가입되어 있는 아이디인 경우 에러 발생!', async () => {
        req.body = signup2;
        User.findOne.mockResolvedValue(signup2);
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '이미 가입한 아이디 또는 이메일입니다.',
        });
    });

    test('이미 가입되어 있는 이메일인 경우 에러 발생!', async () => {
        req.body = signup3;
        User.findOne.mockResolvedValue(signup3);
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '이미 가입한 아이디 또는 이메일입니다.',
        });
    });

    test('이메일 인풋값이 형식에 맞지 않을 때 에러 발생!', async () => {
        req.body = signup6;
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '이메일 형식을 확인해주세요.',
        });
    });
    test('비밀번호 인풋값이 형식에 맞지 않을 때 에러 발생!', async () => {
        req.body = signup7;
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)를 포함해야 합니다.',
        });
    });
    test('아이디 인풋값이 형식에 맞지 않을 때 에러 발생!', async () => {
        req.body = signup8;
        await userController.userSignup(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '아이디는 2자 이상, 10자 이하의 영어 대소문자입니다.',
        });
    });
});
describe('로그인', () => {
    test('아이디 조회 실패 시 에러 발생!', async () => {
        User.findOne.mockResolvedValue(null);
        await userController.login(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '입력창을 다시 확인하세요.',
        });
    });
    test('비밀번호 틀린 경우 에러 발생!', async () => {
        req.body = wrongPW;
        User.findOne.mockResolvedValue(isUser);
        await userController.login(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '비밀번호를 다시 확인해주세요.',
        });
    });
    test('로그인 성공!', async () => {
        req.body = isPW;
        User.findOne.mockResolvedValue(isUser);
        await userController.login(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
});
describe('비밀번호 변경', () => {
    test('기존 비밀번호 인풋값 틀릴 때 에러 발생!', async () => {
        req.body = wrongPWUpdateOne1;
        await userController.modifyPassword(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '기존 비밀번호가 잘못 입력되었습니다.',
        });
    });
    test('변경할 비밀번호 인풋값과 확인 인풋값이 다를 때 에러 발생!', async () => {
        req.body = wrongPWUpdateOne2;
        await userController.modifyPassword(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: false,
            msg: '비밀번호가 다르게 입력되었습니다.',
        });
    });
    test('비밀번호 변경 성공!', async () => {
        req.body = PWUpdateOne;
        User.updateOne.mockResolvedValue({
            encryptedNewpassword:
                'U2FsdGVkX18bGKO7oKlqvuo0mfxSc4VInFasRqraNg5=',
        });
        await userController.modifyPassword(req, res);
        expect(res._getJSONData()).toStrictEqual({
            result: true,
            msg: '정보가 수정되었습니다.',
        });
    });
});
