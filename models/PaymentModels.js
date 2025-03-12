const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const payment = new Schema({
    id: { type: ObjectId },
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

// Override all methods
payment.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.payment || mongoose.model("payment", payment);
