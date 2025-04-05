const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
  id: { type: ObjectId },
  fullName: { type: String, required: true },
  phone: { type: String, match: /^[0-9]{10}$/ },
  email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ!"] },
  image: { type: String },
  address: {
    city: { type: Object, default: null }, // Dùng Object thay vì đặt default trong từng key
    district: { type: Object, default: null },
    ward: { type: Object, default: null },
    street: { type: String, default: "" },
  },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  type: { type: String, default: "SYSTEM" },
  isBlocked: { type: Boolean, default: false },
  password: {
    type: String, required: function () {
      return this.type === "SYSTEM";
    }
  },
  isActive: { type: Boolean, default: false },
  reset_token: { type: String, required: false, default: null },

}, { timestamps: true });

user.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.models.user || mongoose.model("user", user);
