const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        // userID: {
        //     type: String,
        //     unique: true,
        // },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
