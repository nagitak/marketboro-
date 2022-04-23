const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        // userID: {
        //     type: String,
        //     unique: true,
        // },
        product: {
            type: Array,
            required: true,
        },
        orderStatus: {
            type: String,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
