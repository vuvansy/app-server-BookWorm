const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const book = new Schema({
    id: { type: ObjectId },
    id_genre: { type: ObjectId, ref: "genre", required: true},
    name: { type: String, required: true },
    image: { type: String },
    slider:{type: Array},
    price_old: { type: Number, required: true },
    price_new: { type: Number },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String },
    weight: { type: Number },
    size: { type: String },
    publishers: { type: String },
    authors: [{ type: ObjectId, ref: "author", default: [] }],
    year: { type: Number },
    page_count: { type: Number },
    book_cover: { type: String },
}, { timestamps: true });

book.plugin(mongoose_delete, { deletedAt : true, overrideMethods: 'all' });

module.exports = mongoose.models.book || mongoose.model("book", book);
