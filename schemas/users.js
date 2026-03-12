let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username không được trùng"],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: [true, "email không được trùng"],
        required: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role'
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)
