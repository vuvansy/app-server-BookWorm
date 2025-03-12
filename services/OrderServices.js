const orderModel = require("../models/OrderModels");
const aqp = require('api-query-params');

const createOrderService = async (orderData) => {
    try {
        const { products, discountAmount = 0, shippingPrice,
            id_user, id_payment, id_delivery, id_coupons, isPaid = false } = orderData;

        // Tính tổng giá trị đơn hàng (chưa bao gồm phí vận chuyển)
        let order_total = products.reduce((total, product) => {
            return total + (product.detail?.price_new || 0) * product.quantity; // Kiểm tra null safety
        }, 0) - discountAmount;

        const result = await orderModel.create({
            fullname: orderData.fullname,
            phone: orderData.phone,
            email: orderData.email || null,
            address: orderData.address,
            note: orderData.note || "",
            quantity: products.length,
            order_total,
            discountAmount,
            shippingPrice,
            isPaid,
            paidAt: isPaid ? new Date() : null, // Nếu thanh toán thì lưu thời gian
            id_user,
            id_payment,
            id_delivery,
            id_coupons: id_coupons || null
        });

        return { success: true, result };
    } catch (error) {
        return { success: false, message: "Lỗi tạo đơn hàng", error: error.message };
    }
};


module.exports = {
    createOrderService,
}