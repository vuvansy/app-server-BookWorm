const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const post = new Schema({
    id: { type: ObjectId },
    title: { type: String, required: true },
    image: { type: String },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Boolean, default: true },
}, { timestamps: true });

// Override all methods
post.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.post || mongoose.model("post", post);
