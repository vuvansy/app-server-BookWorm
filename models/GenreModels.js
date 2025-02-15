const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const genre = new Schema({
    id: { type: ObjectId },
    name: { type: String, required: true },
    image: { type: String },   
}, { timestamps: true });

module.exports = mongoose.models.genre || mongoose.model("genre", genre);
