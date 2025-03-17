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
        const page = req.query.page ? parseInt(req.query.page) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const data = await getReviewsByBookService(bookId, page, limit);

        if (!data.success) {
            return res.status(500).json({
                statusCode: 500,
                message: data.message,
                data: null
            });
        }

        if (page && limit) {
            return res.status(200).json({
                statusCode: 200,
                message: "Fetch Users with Pagination",
                data: {
                    meta: data.meta,
                    result: data.result
                }
            });
        } else {
            return res.status(200).json({
                statusCode: 200,
                message: "Fetch All Users",
                data: data.result
            });
        }
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ khi lấy danh sách review",
            error: error.message
        });
    }
};


const getReviewedBooksAPI = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const data = await getReviewedBooksService(page, limit);

        if (!data.success) {
            return res.status(500).json({
                statusCode: 500,
                message: data.message,
                data: null
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Fetch Users with Pagination",
            data: {
                meta: data.meta,
                result: data.result
            }
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