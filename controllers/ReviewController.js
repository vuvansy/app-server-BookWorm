const {
    createReviewService, getReviewedOrderDetails, getReviewsByBookService, getReviewedBooksService
} = require('../services/ReviewServices')

const createReviewAPI = async (req, res) => {
    try {
        const { comment, rating, id_user, id_order_detail } = req.body;

        // Kiểm tra thiếu dữ liệu
        if (!comment || !rating || !id_user || !id_order_detail) {
            return res.status(400).json({
                statusCode: 400,
                message: "Vui lòng nhập đầy đủ thông tin!",
            });
        }

        const result = await createReviewService({ comment, rating, id_user, id_order_detail });

        return res.status(result.statusCode).json(result);

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi hệ thống khi thêm review!",
            error: error.message,
        });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const { id_user } = req.params;
        const result = await getReviewedOrderDetails(id_user);

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi hệ thống!",
            error: error.message,
        });
    }
};

const getReviewsByBookAPI = async (req, res) => {
    try {
        const { bookId } = req.params;
        const reviews = await getReviewsByBookService(bookId);

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách review thành công",
            data: reviews
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getReviewedBooksAPI = async (req, res) => {
    try {
        const data = await getReviewedBooksService();

        if (!data.success) {
            return res.status(500).json({
                statusCode: 500,
                message: data.message,
                data: null
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sách đã đánh giá thành công",
            data: data.data
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ khi lấy danh sách sách đã đánh giá",
            error: error.message
        });
    }
};

module.exports = {
    createReviewAPI, getUserReviews, getReviewsByBookAPI, getReviewedBooksAPI
}