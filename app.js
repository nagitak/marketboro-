require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const connect = require('./schemas/index');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use('/api', [productRouter, orderRouter]);

app.use(
    cors({
        origin: process.env.CORS,
        credentials: true,
    })
);

app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 100,
    })
);

app.listen(port, () => {
    console.log(port, '포트로 연결되었습니다.');
});
