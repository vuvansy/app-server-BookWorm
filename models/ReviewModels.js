const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const review = new Schema({
    id: { type: ObjectId },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    id_user: { type: ObjectId, ref: "user", required: true },
    id_order_detail: { type: ObjectId, ref: "order_detail", required: true },
}, { timestamps: true });

// Override all methods
review.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.review || mongoose.model("review", review);
