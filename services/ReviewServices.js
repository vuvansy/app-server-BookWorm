const reviewModel = require("../models/ReviewModels");
const orderDetailModel = require("../models/OrderDetailModels");
const userModel = require("../models/UserModels");
const aqp = require('api-query-params');

const createReviewService = async (reviewData) => {
    try {
        const { comment, rating, id_user, id_order_detail } = reviewData;

        const existingReview = await reviewModel.findOne({ id_order_detail });
        if (existingReview) {
            return {
                success: false,
                statusCode: 400,
                message: "Sản phẩm này đã được đánh giá rồi!",
            };
        }

        const newReview = await reviewModel.create({
            comment,
            rating,
            id_user,
            id_order_detail,
        });

        return {
            success: true,
            statusCode: 201,
            message: "Thêm review thành công!",
            data: newReview,
        };


    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: "Lỗi hệ thống khi thêm review!",
            error: error.message,
        };
    }
};

const getReviewedOrderDetails = async (id_user) => {
    try {
        const reviews = await reviewModel.find({ id_user }).select("id_order_detail");
        return {
            statusCode: 200,
            message: "Lấy danh sách review thành công!",
            data: reviews.map(review => review.id_order_detail.toString()),
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


const getReviewsByBookService = async (bookId, page, limit) => {
    try {
        // Tìm tất cả review có order_detail hợp lệ
        const allReviews = await reviewModel.find()
            .populate({
                path: "id_order_detail",
                select: "id_book",
                populate: { path: "id_book", select: "_id" }
            })
            .populate("id_user", "fullName")
            .sort({ createdAt: -1 });

        // Lọc những review có order_detail hợp lệ và đúng bookId
        const filteredReviews = allReviews.filter(review =>
            review.id_order_detail && review.id_order_detail.id_book?._id.toString() === bookId
        );

        const total = filteredReviews.length;

        let paginatedReviews = filteredReviews;
        if (page && limit) {
            const offset = (page - 1) * limit;
            paginatedReviews = filteredReviews.slice(offset, offset + limit);
        }

        return {
            success: true,
            result: paginatedReviews,
            meta: page && limit ? {
                page,
                limit,
                pages: Math.ceil(total / limit),
                total
            } : null
        };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách review", error);
        return { success: false, message: "Lỗi khi lấy dữ liệu" };
    }
};


const getReviewedBooksService = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const reviewedBooks = await reviewModel.aggregate([
            {
                $lookup: {
                    from: "order_details",
                    localField: "id_order_detail",
                    foreignField: "_id",
                    as: "orderDetail"
                }
            },
            { $unwind: "$orderDetail" },

            {
                $lookup: {
                    from: "books",
                    localField: "orderDetail.id_book",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" },

            {
                $group: {
                    _id: "$bookDetails._id",
                    name: { $first: "$bookDetails.name" },
                    image: { $first: "$bookDetails.image" },
                    avgRating: { $avg: "$rating" }
                }
            },
            { $sort: { avgRating: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalBooks = await reviewModel.aggregate([
            {
                $lookup: {
                    from: "order_details",
                    localField: "id_order_detail",
                    foreignField: "_id",
                    as: "orderDetail"
                }
            },
            { $unwind: "$orderDetail" },

            {
                $lookup: {
                    from: "books",
                    localField: "orderDetail.id_book",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" },

            {
                $group: {
                    _id: "$bookDetails._id"
                }
            },
            { $count: "total" }
        ]);

        const total = totalBooks.length > 0 ? totalBooks[0].total : 0;

        return {
            success: true,
            result: reviewedBooks,
            meta: {
                page,
                limit,
                pages: Math.ceil(total / limit),
                total
            }
        };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sách đã đánh giá", error);
        return { success: false, message: "Lỗi khi lấy dữ liệu" };
    }
};


module.exports = {
    createReviewService, getReviewedOrderDetails, getReviewsByBookService, getReviewedBooksService
}