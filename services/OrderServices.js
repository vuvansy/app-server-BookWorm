const orderModel = require("../models/OrderModels");
const couponModel = require("../models/CouponModels");
const aqp = require('api-query-params');

const createOrderService = async (orderData) => {
    try {
        const { products, discountAmount = 0, shippingPrice,
            id_user, id_payment, id_delivery, id_coupons, isPaid = false } = orderData;

        // Kiểm tra dữ liệu đầu vào
        if (!products || !Array.isArray(products) || products.length === 0) {
            return { success: false, message: "Danh sách sản phẩm không hợp lệ!" };
        }
        if (!id_user || !id_payment || !id_delivery) {
            return { success: false, message: "Thiếu thông tin người dùng, phương thức thanh toán hoặc vận chuyển!" };
        }

        let order_total = products.reduce((total, product) => {
            return total + (product.detail?.price_new || 0) * product.quantity;
        }, 0) - discountAmount;

        const result = await orderModel.create({
            fullName: orderData.fullName,
            phone: orderData.phone,
            email: orderData.email || null,
            address: orderData.address,
            note: orderData.note || "",
            quantity: products.length,
            order_total,
            discountAmount,
            shippingPrice,
            isPaid,
            paidAt: isPaid ? new Date() : null,
            id_user,
            id_payment,
            id_delivery,
            id_coupons: id_coupons || null
        });

        if (id_coupons) {
            const coupon = await couponModel.findById(id_coupons);
            if (!coupon) {
                return { success: false, message: "Mã giảm giá không tồn tại!" };
            }
            if (coupon.quantity <= 0) {
                return { success: false, message: "Mã giảm giá đã hết lượt sử dụng!" };
            }
            // Giảm số lượng coupon
            coupon.quantity -= 1;
            await coupon.save();
        }

        return { success: true, result };
    } catch (error) {
        return { success: false, message: "Lỗi tạo đơn hàng", error: error.message };
    }
};

const getOrdersByUserService = async (id_user) => {
    try {
        if (!id_user) {
            return { success: false, message: "Thiếu ID người dùng!" };
        }

        const orders = await orderModel
            .find({ id_user })
            .sort({ createdAt: -1 })
            .populate("id_payment")
            .populate("id_delivery");


        return { success: true, data: orders };
    } catch (error) {
        return { success: false, message: "Lỗi hệ thống khi lấy danh sách đơn hàng", error: error.message };
    }
};

const getOrderDetailByIdService = async (id_order) => {
    try {
        if (!id_order) {
            return { success: false, message: "Thiếu ID đơn hàng!" };
        }

        const result = await orderModel
            .findById(id_order)
            .populate("id_payment")
            .populate("id_delivery")

        if (!result) {
            return { success: false, message: "Không tìm thấy đơn hàng!" };
        }

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Lỗi hệ thống khi lấy thông tin đơn hàng", error: error.message };
    }
};

module.exports = {
    createOrderService, getOrdersByUserService,
    getOrderDetailByIdService
}