const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const book_like = new Schema({
    id: { type: ObjectId },
    id_user: { type: ObjectId, ref: "user", required: true },
    id_book: { type: ObjectId, ref: "book", required: true },
}, { timestamps: true });

// Override all methods
book_like.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.book_like || mongoose.model("book_like", book_like);
