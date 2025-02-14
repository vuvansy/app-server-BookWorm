const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
    id: { type: ObjectId },
    fullName: { type: String, required: true },
    image: { type: String },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    email: { type: String, required: true },
    address: { type: String },
    role: { type: String },
    isActive: { type: Boolean },
    password: { type: String },
    type: { type: String },
     //Token chỉ được dùng một lần duy nhất, token có giới hạn thời gian
    reset_token: { type: String, required: false, default: null },
    
}, { timestamps: true });

module.exports = mongoose.models.user || mongoose.model("user", user);
