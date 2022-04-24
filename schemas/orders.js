const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // userID: {
        //     type: String,
        //     unique: true,
        // },
        productName: {
            type: Array,
            required: true,
        },
        productCount: {
            type: Array,
            required: true,
        },
        orderStatus: {
            type: String,
            require: true,
        },
        userID: {
            type: String,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
