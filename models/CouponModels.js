const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const coupon = new Schema({
    id: { type: ObjectId },
    code: { type: String, required: true, unique: true },//Mã giảm giá, người dùng nhập để áp dụng.
    value: { type: Number, required: true }, // Giá trị giảm giá
    max_value: { type: Number, required: true }, //Mức giảm tối đa nếu value là phần trăm.
    min_total: { type: Number, required: true }, // Tổng tiền đơn hàng tối thiểu để dùng mã.
    description: { type: String },
    quantity: { type: Number, default: 0 }, // Số lượng mã còn lại
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    start_date: { type: Date },
    end_date: { type: Date },
}, { timestamps: true });

// Override all methods
coupon.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.coupon || mongoose.model("coupon", coupon);
