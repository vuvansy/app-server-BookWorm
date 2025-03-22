const {
    getStatsServices
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

module.exports = {
    getStatsAPI
}