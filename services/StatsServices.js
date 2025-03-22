const genreModel = require("../models/GenreModels");
const bookModel = require("../models/BookModels");
const aqp = require('api-query-params');
const orderModel = require("../models/OrderModels");
const orderDetailModel = require("../models/OrderDetailModels");
const couponModel = require("../models/CouponModels");
const paymentModel = require("../models/PaymentModels");
const reviewModel = require("../models/ReviewModels");
const userModel = require("../models/UserModels");

const getStatsServices = async () => {
    try {
        // 1. Tính tổng số đơn hàng
        const totalOrders = await orderModel.countDocuments();

        // 2. Tính doanh thu với đơn hàng trạng thái = 3 (thành công)
        const totalRevenueResult = await orderModel.aggregate([
            { $match: { status: 3 } }, // Lọc đơn hàng có status = 3 (thành công)
            { $group: { _id: null, total: { $sum: "$order_total" } } } // Tính tổng từ order_total
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;


        // 3. Tính tổng người dùng
        const totalUsers = await userModel.countDocuments();

        // 4. Tính tổng đánh giá
        const totalReviews = await reviewModel.countDocuments();

        // 5. Tính tổng sản phẩm
        const totalProducts = await bookModel.countDocuments();

        return {
            totalOrders,
            totalRevenue,
            totalUsers,
            totalReviews,
            totalProducts
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getStatsServices
}