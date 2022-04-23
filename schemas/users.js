const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
    {
        // userID: {
        //     type: String,
        //     unique: true,
        // },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        userType: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', usersSchema);
