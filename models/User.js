const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    college: { type: String },
    occupation: { type: String },
    annualIncome: { type: Number },
    country: { type: String },
    state: { type: String },
    bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
