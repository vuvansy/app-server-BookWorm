const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const order_detail = new Schema({
    id: { type: ObjectId },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    id_book: { type: ObjectId, ref: "book", required: true },
    id_order: { type: ObjectId, ref: "order", required: true },
}, { timestamps: true });

// Override all methods
order_detail.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.order_detail || mongoose.model("order_detail", order_detail);
