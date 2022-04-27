const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
        },
        price: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
