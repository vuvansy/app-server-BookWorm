const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const genre = new Schema({
    id: { type: ObjectId },
    name: { type: String, required: true },
    image: { type: String },   
}, { timestamps: true });

// Override all methods
genre.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.genre || mongoose.model("genre", genre);
