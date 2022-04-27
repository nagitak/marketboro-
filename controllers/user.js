const User = require('../schemas/users');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.userSignup = async (req, res) => {
    try {
        const userSchema = Joi.object({
            userID: Joi.string()
                .pattern(/^[A-Za-z\d]{2,10}$/)
                .required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]{8,16}$/
                )
                .required(),
            confirmPassword: Joi.required(),
        });

        const { userID, email, password, confirmPassword } =
            await userSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            return res.status(400).json({
                result: false,
                msg: '비밀번호가 다르게 입력되었습니다.',
            });
        }

        const checkUser = await User.findOne({ $or: [{ userID }, { email }] });

        if (checkUser) {
            return res.status(400).json({
                result: false,
                msg: '이미 가입한 아이디 또는 이메일입니다.',
            });
        }

        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(password),
            process.env.PRIVATE_KEY
        ).toString();

        await User.create({
            userID: userID,
            email: email,
            password: encrypted,
        });

        res.status(200).json({
            result: true,
            msg: '회원가입이 완료되었습니다.',
        });
    } catch (error) {
        let joiError = error.details[0].message;
        if (joiError.includes('email')) {
            res.status(400).json({
                result: false,
                msg: '이메일 형식을 확인해주세요.',
            });
        }
        if (joiError.includes('password')) {
            res.status(400).json({
                result: false,
                msg: '비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)를 포함해야 합니다.',
            });
        }
        if (joiError.includes('userID')) {
            res.status(400).json({
                result: false,
                msg: '아이디는 2자 이상, 10자 이하의 영어 대소문자입니다.',
            });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const { userID, password } = req.body;

        const checkUser = await User.findOne({
            userID,
        });
        if (checkUser === null) {
            return res.status(400).json({
                result: false,
                msg: '입력창을 다시 확인하세요.',
            });
        }

        const bytes = CryptoJS.AES.decrypt(
            checkUser.password,
            process.env.PRIVATE_KEY
        );
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (password !== decrypted) {
            return res.status(400).json({
                result: false,
                msg: '비밀번호를 다시 확인해주세요.',
            });
        }

        const token = jwt.sign(
            {
                userID: checkUser.userID,
            },
            process.env.TOKEN_SECRET_KEY
        );

        res.status(200).json({
            result: true,
            token,
            msg: `${checkUser.userID}님 환영합니다!`,
        });
    } catch (err) {
        res.status(400).json({
            result: false,
            msg: '입력창을 확인해주세요.',
        });
    }
};

exports.modifyPassword = async (req, res) => {
    try {
        const userSchema = Joi.object({
            password: Joi.required(),
            newPassword: Joi.string()
                .pattern(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]{8,16}$/
                )
                .required(),
            confirmNewPassword: Joi.string()
                .pattern(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]{8,16}$/
                )
                .required(),
        });
        const { user } = res.locals;
        const { password, newPassword, confirmNewPassword } =
            await userSchema.validateAsync(req.body);

        const decryptedpassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PRIVATE_KEY
        );
        const parseDecryptedPassword = JSON.parse(
            decryptedpassword.toString(CryptoJS.enc.Utf8)
        );

        if (parseDecryptedPassword !== password) {
            res.status(400).json({
                result: false,
                msg: '기존 비밀번호가 잘못 입력되었습니다.',
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                result: false,
                msg: '비밀번호가 다르게 입력되었습니다.',
            });
            return;
        }

        const encryptedNewpassword = CryptoJS.AES.encrypt(
            JSON.stringify(newPassword),
            process.env.PRIVATE_KEY
        ).toString();

        await User.updateOne(
            { userID: user.userID },
            { $set: { password: encryptedNewpassword } }
        );

        res.status(200).json({
            result: true,
            msg: '정보가 수정되었습니다.',
        });
    } catch (error) {
        let joiError = error.details[0].message;
        if (joiError.includes('newPassword')) {
            res.status(400).json({
                result: false,
                msg: '비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)를 포함해야 합니다.',
            });
        }
    }
};

exports.sendEmail = async (req, res) => {
    // ID 또는 PW를 잊어버린 경우 node-mailer를 통해 ID 또는 임시패스워드를 보내줍니다.
    try {
        const { userID, email } = req.body;
        if (!email)
            return res.status(400).json({
                result: false,
                msg: '이메일을 입력해주세요.',
            });

        const user = await User.findOne({
            email,
        });

        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        if (!userID) {
            let mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: '찾으시는 ID 입니다.',
                text: `회원님의 아이디는 ${user.userID} 입니다.`,
            };

            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return;
                }
            });

            res.status(200).json({
                result: true,
                msg: '아이디가 메일로 전송되었습니다.',
            });
        }

        if (userID) {
            if (user.userID !== userID) {
                return res.status(400).json({
                    result: false,
                    msg: '가입한 아이디 이메일을 입력해주세요.',
                });
            } else {
                function createCode(iLength) {
                    let characters =
                        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^*_-';
                    let randomStr = '';
                    for (let i = 0; i < iLength; i++) {
                        randomStr += characters.charAt(
                            Math.floor(Math.random() * characters.length)
                        );
                    }
                    return randomStr;
                }
                let randomPw = createCode(12);

                const encrypted = CryptoJS.AES.encrypt(
                    JSON.stringify(randomPw),
                    process.env.PRIVATE_KEY
                ).toString();

                await User.updateOne(
                    { userID: user.userID },
                    { $set: { password: encrypted } }
                );

                let mailOptions = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: '찾으시는 PASSWORD 입니다.',
                    text: `${user.userID}님의 비밀번호는 ${randomPw} 입니다. 임시 비밀번호이니, 로그인 후 비밀번호를 꼭 변경하세요!`,
                };
                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                });
                res.status(200).json({
                    result: true,
                    msg: '임시 비밀번호가 메일로 전송되었습니다.',
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            result: false,
            msg: '다시 입력해주세요.',
        });
    }
};
