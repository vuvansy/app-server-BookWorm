const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const banner = new Schema({
    id: { type: ObjectId },
    name: { type: String, required: true },
    image: { type: String },
    status: { type: Boolean, default: true }, // true: Hiện, false: Ẩn
}, { timestamps: true });

// Override all methods
banner.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.banner || mongoose.model("banner", banner);
