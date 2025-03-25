const mongoose = require("mongoose");
const orderModel = require("../models/OrderModels");
const orderDetailModel = require("../models/OrderDetailModels");
const couponModel = require("../models/CouponModels");
const bookModel = require("../models/BookModels");
const aqp = require('api-query-params');
const mailer = require("nodemailer");
const getConstants = require("../helpers/constants").getConstants;
const paymentModel = require("../models/PaymentModels");
require("dotenv").config();

const getOrdersService = async (limit, page, status, queryString) => {
    try {
        let filter = {};
        const parsedQuery = aqp(queryString);
        const queryFilter = parsedQuery.filter || {};
        const querySort = parsedQuery.sort || {};

        delete queryFilter.page;

        if (status) {
            filter.status = status;
        }


        let sort = {};
        if (queryString.sort) {
            let sortField = queryString.sort;
            if (sortField.startsWith('-')) {
                sortField = sortField.substring(1);
                sort[sortField] = -1;
            } else {
                sort[sortField] = 1;
            }
        } else {
            sort = { createdAt: 1 };
        }

        let result;
        if (page && limit) {
            let offset = (page - 1) * limit;
            result = await orderModel.find(filter)
                .skip(offset)
                .limit(limit)
                .sort(sort)
                .populate("id_payment")
                .populate("id_delivery")
                .exec();
        } else {
            result = await orderModel.find(filter)
                .sort(sort)
                .populate("id_payment")
                .populate("id_delivery")
                .exec();
        }
        // Lấy tổng số đơn hàng không có filter
        const totalOrders = await orderModel.countDocuments({});

        // Lấy tổng số đơn hàng có filter
        const total = await orderModel.countDocuments(filter);

        const defaultStatusCounts = {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "": totalOrders
        };

        const statusCounts = await orderModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        statusCounts.forEach(item => {
            defaultStatusCounts[item._id] = item.count;
        });


        return { result, total, statusCounts: defaultStatusCounts };
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
};

const getOrdersByUserService = async (id_user, status) => {
    try {
        if (!id_user) {
            return { success: false, message: "Thiếu ID người dùng!" };
        }

        const userId = new mongoose.Types.ObjectId(id_user);

        const totalOrders = await orderModel.find({ id_user: userId });

        let filter = { id_user: userId };
        if (status) {
            filter.status = status;
        }

        const orders = await orderModel
            .find(filter)
            .sort({ createdAt: -1 })
            .populate("id_payment")
            .populate("id_delivery");

        const statusCounts = await orderModel.aggregate([
            { $match: { id_user: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const defaultStatusCounts = {
            "0": 0, 
            "1": 0, 
            "2": 0, 
            "3": 0, 
            "4": 0, 
            "": totalOrders.length 
        };

        statusCounts.forEach(item => {
            defaultStatusCounts[item._id.toString()] = item.count;
        });

        return {
            success: true,
            data: orders,
            statusCounts: defaultStatusCounts
        };
    } catch (error) {
        console.log("Error >>>", error);
        return {
            success: false,
            message: "Lỗi hệ thống khi lấy danh sách đơn hàng",
            error: error.message
        };
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


const updateOrderStatusService = async (id_order, new_status) => {
    try {
        if (!id_order || new_status === undefined) {
            return { success: false, message: "Thiếu thông tin đơn hàng hoặc trạng thái mới!" };
        }

        const order = await orderModel.findById(id_order);
        if (!order) {
            return { success: false, message: "Không tìm thấy đơn hàng!" };
        }

        // (status === 4)
        if (new_status === 4) {
            const orderDetails = await orderDetailModel.find({ id_order });
            if (orderDetails.length === 0) {
                return { success: false, message: "Không tìm thấy chi tiết đơn hàng!" };
            }
            // console.log(orderDetails);

            // Hoàn lại số lượng sách vào kho
            const updatePromises = orderDetails.map((item) => {
                return bookModel.findByIdAndUpdate(
                    item.id_book,
                    { $inc: { quantity: item.quantity } },
                    { new: true }
                );
            });

            await Promise.all(updatePromises);
        }

        // Nếu trạng thái là 3 (thành công) -> Cập nhật isPaid = true
        const updateData = { status: new_status };
        if (new_status === 3) {
            updateData.isPaid = true;
            updateData.paidAt = new Date();
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            id_order,
            updateData, // Truyền toàn bộ dữ liệu cần cập nhật
            { new: true }
        );

        if (!updatedOrder) {
            return { success: false, message: "Không thể cập nhật đơn hàng!" };
        }

        return { success: true, data: updatedOrder };
    } catch (error) {
        return { success: false, message: "Lỗi hệ thống khi cập nhật trạng thái đơn hàng", error: error.message };
    }
};


const createOrderService = async (orderData) => {
    try {
        const { products, discountAmount = 0, shippingPrice, id_user, id_payment, id_delivery, id_coupons, isPaid = false } = orderData;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return { success: false, message: "Danh sách sản phẩm không hợp lệ!" };
        }
        if (!id_user || !id_payment || !id_delivery) {
            return { success: false, message: "Thiếu thông tin người dùng, phương thức thanh toán hoặc vận chuyển!" };
        }

        let order_total = products.reduce((total, product) => {
            return total + (product.detail?.price_new || 0) * product.quantity;
        }, 0) - discountAmount;

        // Kiểm tra và trừ số lượng sản phẩm tồn kho
        for (const product of products) {
            const productData = await bookModel.findById(product._id);
            if (!productData) {
                return { success: false, message: `Sản phẩm có ID ${product.id} không tồn tại!` };
            }
            if (productData.quantity < product.quantity) {
                return { success: false, message: `Sản phẩm ${productData.name} không đủ số lượng tồn kho!` };
            }
            productData.quantity -= product.quantity;
            await productData.save();
        }

        const newOrder = await orderModel.create({
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
        // Truy vấn lại đơn hàng để populate dữ liệu
        const populatedOrder = await orderModel
            .findById(newOrder._id)
            .populate("id_payment")
            .populate("id_delivery");
        // Giảm số lượng mã giảm giá
        if (id_coupons) {
            const coupon = await couponModel.findById(id_coupons);
            if (!coupon) {
                return { success: false, message: "Mã giảm giá không tồn tại!" };
            }
            if (coupon.quantity <= 0) {
                return { success: false, message: "Mã giảm giá đã hết lượt sử dụng!" };
            }
            coupon.quantity -= 1;
            await coupon.save();
        }

        // Gửi email xác nhận đơn hàng nếu có email & không phải thanh toán VNPay
        const paymentMethod = await paymentModel.findById(id_payment);
        console.log(paymentMethod?.name.toLowerCase());
        if (orderData.email && paymentMethod?.name.toLowerCase() !== "thanh toán qua vnpay") {
            await sendOrderConfirmationEmail(orderData.email, populatedOrder);
        }

        return { success: true, result: populatedOrder };
    } catch (error) {
        return { success: false, message: "Lỗi tạo đơn hàng", error: error.message };
    }
};

const updateOrderPaymentStatusService = async (orderId, isPaid) => {
    try {
        if (!orderId) {
            return { success: false, message: "Thiếu thông tin orderId!" };
        }

        const order = await orderModel
            .findById(orderId)
            .populate("id_user")
            .populate("id_payment")
            .populate("id_delivery");

        if (!order) {
            return { success: false, message: "Không tìm thấy đơn hàng!" };
        }

        if (isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            await order.save();

            if (order.id_user?.email) {
                await sendOrderConfirmationEmail(order.id_user.email, order);
            }

            return { success: true, message: "Thanh toán thành công, đã cập nhật đơn hàng!", order };
        } else {
            const orderDetails = await orderDetailModel.find({ id_order: orderId });
            // console.log(orderDetails);
            if (orderDetails.length === 0) {
                return { success: false, message: "Không tìm thấy chi tiết đơn hàng!" };
            }

            // console.log(orderDetails);
            const updatePromises = orderDetails.map((item) => {
                return bookModel.findByIdAndUpdate(
                    item.id_book,
                    { $inc: { quantity: item.quantity } },
                    { new: true }
                );
            });

            await Promise.all(updatePromises);

            order.status = 4; // Status 4: Thanh toán thất bại
            await order.save();
            return { success: true, message: "Thanh toán thất bại, đã cập nhật trạng thái đơn hàng!", order };
        }
    } catch (error) {
        return { success: false, message: "Lỗi hệ thống khi cập nhật thanh toán", error: error.message };
    }
};



// Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (email, order) => {
    const addressString = `${order.address.street}, ${order.address.ward.name}, ${order.address.district.name}, ${order.address.city.name}`;
    const statusMap = {
        0: "Chờ Xác Nhận",
        1: "Đã Xác Nhận",
        2: "Đang Vận Chuyển",
        3: "Đã Giao Hàng",
        4: "Đã Hủy"
    };
    const mailOptions = {
        from: getConstants().MAIL, // Email người gửi
        to: email, // Email người nhận
        subject: "📦 Xác nhận đơn hàng của bạn",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center;">
                <h2 style="color: #007BFF;">✅ Đơn hàng của bạn đã được xác nhận</h2>
                <p>Xin chào <strong>${order.fullName}</strong>,</p>
                <p>Cảm ơn bạn đã đặt hàng tại website BooksWorm. Dưới đây là thông tin đơn hàng của bạn:</p>
                <hr>
            </div>
            <div>
                <h3 style="color: #007BFF;">Thông Tin Khách Hàng</h3>
                <p><strong>Tên:</strong> ${order.fullName}</p>
                <p><strong>Số điện thoại:</strong> ${order.phone}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Địa chỉ giao hàng:</strong> ${addressString}</p>
            </div>
            <div>
                <h3 style="color: #007BFF;">Thông Tin Đơn Hàng</h3>
                <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.id_payment.name}</p>
                <p><strong>Phương thức vận chuyển:</strong> ${order.id_delivery.name}</p>
                <p><strong>Tổng tiền:</strong> ${(order.order_total - order.discountAmount + order.shippingPrice).toLocaleString()} VND</p>
                <p><strong>Trạng thái đơn hàng:</strong> ${statusMap[order.status] || "Không xác định"}</p>
                <p><strong>Thanh toán:</strong> ${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                <hr>
            </div>
            <div style="text-align: center;">
                <p style="font-size: 14px; color: #777;">Bạn sẽ nhận được thông báo khi đơn hàng của bạn được vận chuyển.</p>
                <p style="font-size: 12px; color: #999;">© 2025 BookWorm. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email xác nhận đơn hàng đã được gửi thành công!");
    } catch (error) {
        console.error("Lỗi khi gửi email xác nhận đơn hàng:", error);
    }
};


//send email
const transporter = mailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: getConstants().MAIL,
        pass: getConstants().APP_PASSWORD,

    },

});

module.exports = {
    createOrderService, getOrdersByUserService,
    getOrderDetailByIdService, updateOrderStatusService,
    updateOrderPaymentStatusService, getOrdersService
}