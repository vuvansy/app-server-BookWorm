const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const author = new Schema({
    id: { type: ObjectId },
    name: { type: String, required: true, unique: true }, // Đặt unique để tránh trùng  
}, { timestamps: true });

// Override all methods
author.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.author || mongoose.model("author", author);
