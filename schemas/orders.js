const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            unique: true,
        },
        productName: {
            type: Array,
        },
        productCount: {
            type: Array,
        },
        orderStatus: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
