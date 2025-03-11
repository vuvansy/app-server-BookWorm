const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const delivery = new Schema({
    id: { type: ObjectId },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
}, { timestamps: true });

// Override all methods
delivery.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.delivery || mongoose.model("delivery", delivery);