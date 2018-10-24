const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

const userSchema = new Schema({
    name: { type: String, unique: true, required: [true, "Name is required"] },
    email: { type: String, unique: true, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"] },
    img: { type: String, required: false, default: undefined },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        enum: validRoles
    },
    users: {
        type: [{ id: Schema.Types.ObjectId, date: String, message: String }],
        ref: "User",
        default: []
    },
    google: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

module.exports = mongoose.model('User', userSchema);