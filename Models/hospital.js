const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, unique: true, required: [true, "Name is required"] },
    img: { type: String, required: false },
    users: { type: [{ id: Schema.Types.ObjectId, date: String, message: String }], ref: 'User', default: [] }
});

module.exports = mongoose.model("Hospital", hospitalSchema);