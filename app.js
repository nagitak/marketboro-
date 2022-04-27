require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const connect = require('./schemas/index');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use('/api', [userRouter, productRouter, orderRouter]);

// CORS를 이용하여 검증되지 않은 사이트로부터의 요청을 방어합니다.
app.use(
    cors({
        origin: process.env.CORS,
        credentials: true,
    })
);

// express-rate-limit을 이용하여 DoS 공격을 방어합니다.
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 100,
    })
);

app.listen(port, () => {
    console.log('서버가 연결되었습니다.');
});
