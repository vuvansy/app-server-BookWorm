const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const book = new Schema({
    id: { type: ObjectId },
    id_genre: { type: ObjectId, ref: "genre" },
    name: { type: String, required: true },
    image: { type: String },
    slider:{type: Array},
    price_old: { type: Number },
    price_new: { type: Number },
    quantity: { type: Number },
    description: { type: String },
    status: { type: String },
    weight: { type: Number },
    size: { type: String },
    publishers: { type: String },
    year: { type: Number },
    page_count: { type: Number },
    bookjacket: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.book || mongoose.model("book", book);
