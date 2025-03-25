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

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        if (year && month) {
            // **Lấy dữ liệu theo tuần trong tháng**
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);

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
            const totalWeeks = Math.ceil(endDate.getDate() / 7);

            for (let i = 0; i < totalWeeks; i++) {
                formattedResult[`${year}-W${i + 1}`] = 0;
            }

            revenueData.forEach(item => {
                let key = `${item._id.year}-W${item._id.weekOfMonth + 1}`;
                formattedResult[key] = item.totalRevenue;
            });
        } else {
            // **Trả về theo tháng**
            let monthsRange = year ? 12 : 6;
            let startMonth = year ? 1 : currentMonth - 5;
            let startYear = year ? year : currentYear;

            if (startMonth <= 0) {
                startMonth += 12;
                startYear -= 1;
            }

            for (let i = 0; i < monthsRange; i++) {
                let actualMonth = (startMonth + i - 1) % 12 + 1;
                let actualYear = startYear + Math.floor((startMonth + i - 1) / 12);

                formattedResult[`${actualYear}-${actualMonth}`] = 0;
            }

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

const getUserStatsService = async (year, month) => {
    try {
        let filter = {};
        let startDate, endDate, groupBy, formatKey;
        let resultType = "month";

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (year && month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
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
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
            groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
            formatKey = "_id.month";
        } else {
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

        filter.createdAt = { $gte: startDate, $lte: endDate };

        const userData = await userModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: groupBy,
                    totalUsers: { $sum: 1 }
                }
            },
            { $sort: { [formatKey]: 1 } }
        ]);

        let formattedResult = {};

        if (resultType === "week") {
            const totalWeeks = Math.ceil(endDate.getDate() / 7);

            for (let i = 0; i < totalWeeks; i++) {
                formattedResult[`${year}-W${i + 1}`] = 0;
            }

            userData.forEach(item => {
                let key = `${year}-W${item._id.weekOfMonth + 1}`;
                formattedResult[key] = item.totalUsers;
            });
        } else {
            let monthsRange = year ? 12 : 6;
            let startMonth = year ? 1 : currentMonth - 5;
            let startYear = year ? year : currentYear;

            if (startMonth <= 0) {
                startMonth += 12;
                startYear -= 1;
            }

            for (let i = 0; i < monthsRange; i++) {
                let actualMonth = (startMonth + i - 1) % 12 + 1;
                let actualYear = startYear + Math.floor((startMonth + i - 1) / 12);

                formattedResult[`${actualYear}-${actualMonth}`] = 0;
            }

            userData.forEach(item => {
                let key = `${item._id.year}-${item._id.month}`;
                formattedResult[key] = item.totalUsers;
            });
        }

        return { success: true, data: formattedResult };
    } catch (error) {
        console.error("Lỗi thống kê người dùng:", error);
        return { success: false, message: "Lỗi hệ thống", error: error.message };
    }
};

const getOrderStatsService = async (year, month) => {
    try {
        let filter = { status: { $in: [2, 3, 4] } };
        let startDate, endDate, groupBy, formatKey;
        let resultType = "month";

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (year && month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
            groupBy = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                weekOfMonth: {
                    $floor: {
                        $divide: [
                            { $subtract: [{ $dayOfMonth: "$createdAt" }, 1] }, 7
                        ]
                    }
                },
                status: "$status"
            };
            formatKey = "_id.weekOfMonth";
            resultType = "week";
        } else if (year) {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
            groupBy = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                status: "$status"
            };
            formatKey = "_id.month";
        } else {
            let startMonth = currentMonth - 5;
            let startYear = currentYear;

            if (startMonth <= 0) {
                startMonth += 12;
                startYear -= 1;
            }

            startDate = new Date(startYear, startMonth - 1, 1);
            endDate = new Date(currentYear, currentMonth, 0);
            groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, status: "$status" };
            formatKey = "_id.month";
        }

        filter.createdAt = { $gte: startDate, $lte: endDate };

        const orderData = await orderModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: groupBy,
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { [formatKey]: 1 } }
        ]);

        const statusMap = {
            2: "shipping",
            3: "completed",
            4: "cancelled"
        };

        let formattedResult = {};

        if (resultType === "week") {
            const totalWeeks = Math.ceil(endDate.getDate() / 7);

            for (let i = 0; i < totalWeeks; i++) {
                formattedResult[`${year}-W${i + 1}`] = { shipping: 0, completed: 0, cancelled: 0 };
            }

            orderData.forEach(item => {
                let key = `${year}-W${item._id.weekOfMonth + 1}`;
                let status = statusMap[item._id.status];

                if (!formattedResult[key]) {
                    formattedResult[key] = { shipping: 0, completed: 0, cancelled: 0 };
                }

                formattedResult[key][status] = item.totalOrders;
            });
        } else {
            let monthsRange = year ? 12 : 6;
            let startMonth = year ? 1 : currentMonth - 5;
            let startYear = year ? year : currentYear;

            if (startMonth <= 0) {
                startMonth += 12;
                startYear -= 1;
            }

            for (let i = 0; i < monthsRange; i++) {
                let actualMonth = (startMonth + i - 1) % 12 + 1;
                let actualYear = startYear + Math.floor((startMonth + i - 1) / 12);

                formattedResult[`${year}-${actualMonth}`] = { shipping: 0, completed: 0, cancelled: 0 };
            }

            orderData.forEach(item => {
                let key = `${year}-${item._id.month}`;
                let status = statusMap[item._id.status];

                if (!formattedResult[key]) {
                    formattedResult[key] = { shipping: 0, completed: 0, cancelled: 0 };
                }

                formattedResult[key][status] = item.totalOrders;
            });
        }

        return { success: true, data: formattedResult };
    } catch (error) {
        console.error("Lỗi thống kê đơn hàng:", error);
        return { success: false, message: "Lỗi hệ thống", error: error.message };
    }
};



const getLowStockBooksService = async () => {
    try {
        const result = await bookModel.find({ quantity: { $lte: 10 } });

        return { success: true, data: result };
    } catch (error) {
        console.error("Lỗi lấy danh sách sách số lượng thấp:", error);
        return { success: false, message: "Lỗi hệ thống", error: error.message };
    }
};




module.exports = {
    getStatsServices, getRevenueStatsServices, getUserStatsService,
    getOrderStatsService, getLowStockBooksService
}