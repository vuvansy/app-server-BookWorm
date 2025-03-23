const {
    getStatsServices, getRevenueStatsServices
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

module.exports = {
    getStatsAPI, getRevenueStatsAPI
}