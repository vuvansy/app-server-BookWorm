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
            { $match: { status: 3, isPaid: true } },
            { $group: { _id: null, total: { $sum: "$order_total" } } }
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

const currentDate = new Date();
const currentYear = currentDate.getFullYear(); 
const currentMonth = currentDate.getMonth() + 1;

const getRevenueStatsServices = async (year, month) => {
    try {
        let filter = {
            status: 3,  // Chỉ lấy đơn hàng thành công
            isPaid: true // Đã thanh toán
        };

        let startDate, endDate, groupBy, formatKey;
        let resultType = "month"; // Mặc định trả về theo tháng

        if (year && month) {
            // **Tính toán ngày đầu & cuối của tháng**
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);

            // **Tính toán tuần của tháng**
            groupBy = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                weekOfMonth: {
                    $floor: {
                        $divide: [
                            { $subtract: [{ $dayOfMonth: "$createdAt" }, 1] }, 7
                        ]
                    }
                }
            };

            formatKey = "_id.weekOfMonth";
            resultType = "week";
        } else if (year) {
            // **Lấy dữ liệu theo tháng của năm**
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
            groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
            formatKey = "_id.month";
        } else {
            // **Mặc định lấy 6 tháng gần nhất**
            let startMonth = currentMonth - 5;
            let startYear = currentYear;

            if (startMonth <= 0) {
                startMonth += 12;
                startYear -= 1;
            }

            startDate = new Date(startYear, startMonth - 1, 1);
            endDate = new Date(currentYear, currentMonth, 0);
            groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
            formatKey = "_id.month";
        }

        // **Áp dụng filter ngày**
        filter.createdAt = { $gte: startDate, $lte: endDate };

        // **Truy vấn MongoDB**
        const revenueData = await orderModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: groupBy,
                    totalRevenue: { $sum: "$order_total" }
                }
            },
            { $sort: { [formatKey]: 1 } }
        ]);

        // **Xử lý kết quả**
        let formattedResult = {};

        if (resultType === "week") {
            // **Trả về theo tuần của tháng**
            const totalWeeks = Math.ceil(endDate.getDate() / 7); // Số tuần trong tháng

            for (let i = 0; i < totalWeeks; i++) {
                formattedResult[`${year}-W${i + 1}`] = 0;
            }

            // **Cập nhật dữ liệu từ MongoDB**
            revenueData.forEach(item => {
                let key = `${item._id.year}-W${item._id.weekOfMonth + 1}`;
                formattedResult[key] = item.totalRevenue;
            });
        } else {
            // **Trả về theo tháng**
            let monthsRange = year ? 12 : 6;
            let startMonth = year ? 1 : currentMonth - 5;
            let startYear = currentYear;

            if (startMonth <= 0) {
                startMonth += 12;
                startYear -= 1;
            }

            for (let i = 0; i < monthsRange; i++) {
                let actualMonth = (startMonth + i - 1) % 12 + 1;
                let actualYear = startYear + Math.floor((startMonth + i - 1) / 12);

                formattedResult[`${actualYear}-${actualMonth}`] = 0;
            }

            // **Cập nhật dữ liệu từ MongoDB**
            revenueData.forEach(item => {
                let key = `${item._id.year}-${item._id.month}`;
                formattedResult[key] = item.totalRevenue;
            });
        }

        return { success: true, data: formattedResult };
    } catch (error) {
        console.error("Lỗi thống kê doanh thu:", error);
        return { success: false, message: "Lỗi hệ thống", error: error.message };
    }
};





module.exports = {
    getStatsServices, getRevenueStatsServices
}