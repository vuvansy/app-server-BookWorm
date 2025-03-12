const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const order = new Schema({
    id: { type: ObjectId },
    fullname: { type: String, required: true },
    phone: { type: String, match: /^[0-9]{10,15}$/, required: true },
    email: { type: String, match: /^\S+@\S+\.\S+$/, default: null },
    address: { type: String, required: true },
    note: { type: String },
    quantity: { type: String },
    status: {
        type: Number,
        enum: [0, 1, 2, 3, 4], // Chỉ chấp nhận các giá trị này
        default: 0, // 0 = Chờ xử lý (pending)
    },
    shippingPrice: { type: Number, required: true, default: 0 },
    order_total: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    id_user: { type: ObjectId, ref: "user", required: true }, // Liên kết với bảng User
    id_payment: { type: ObjectId, ref: "payment", required: true },
    id_delivery: { type: ObjectId, ref: "delivery", required: true },
    id_coupons: { type: ObjectId, ref: "coupon", default: null },
}, { timestamps: true });

// Override all methods
order.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.order || mongoose.model("order", order);
