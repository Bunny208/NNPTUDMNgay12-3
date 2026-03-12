let mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, "name không được trùng"],
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('role', roleSchema)
