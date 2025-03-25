const {
    getStatsServices, getRevenueStatsServices, getUserStatsService,
    getOrderStatsService, getLowStockBooksService
} = require('../services/StatsServices')


const getStatsAPI = async (req, res) => {
    try {
        const stats = await getStatsServices();
        res.status(200).json({
            statusCode: 500,
            message: 'Danh sách số liệu thống kê',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
}

const getRevenueStatsAPI = async (req, res) => {
    try {
        const { year, month } = req.query;
        const parsedYear = year ? parseInt(year) : null;
        const parsedMonth = month ? parseInt(month) : null;

        const result = await getRevenueStatsServices(parsedYear, parsedMonth);

        if (!result.success) {
            return res.status(500).json({ message: result.message, error: result.error });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Thống kê doanh thu thành công!",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi thống kê doanh thu",
            error: error.message
        });
    }
};

const getUserStatsAPI = async (req, res) => {
    try {
        const { year, month } = req.query;
        const parsedYear = year ? parseInt(year) : null;
        const parsedMonth = month ? parseInt(month) : null;

        const result = await getUserStatsService(parsedYear, parsedMonth);

        if (!result.success) {
            return res.status(500).json({ message: result.message, error: result.error });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Thống kê người dùng thành công!",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi thống kê người dùng",
            error: error.message
        });
    }
};


const getOrderStatsAPI = async (req, res) => {
    try {
        const { year, month } = req.query;
        const parsedYear = year ? parseInt(year) : null;
        const parsedMonth = month ? parseInt(month) : null;

        const result = await getOrderStatsService(parsedYear, parsedMonth);

        if (!result.success) {
            return res.status(500).json({ message: result.message, error: result.error });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Thống kê đơn hàng thành công!",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi thống kê đơn hàng",
            error: error.message
        });
    }
};

const getLowStockBooksAPI = async (req, res) => {
    try {
        const result = await getLowStockBooksService();

        if (!result.success) {
            return res.status(500).json({ 
                statusCode: 500,
                message: result.message, 
                error: result.error });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sách số lượng thấp thành công!",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy danh sách sách số lượng thấp",
            error: error.message
        });
    }
};


module.exports = {
    getStatsAPI, getRevenueStatsAPI, getUserStatsAPI,
    getOrderStatsAPI, getLowStockBooksAPI
}