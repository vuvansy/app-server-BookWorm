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

const getReviewsByBookService = async (bookId) => {
    // Lấy danh sách review thông qua order_detail -> book
    const reviews = await reviewModel.find()
        .populate({
            path: "id_order_detail",
            match: { id_book: bookId },
            select: "id_book"
        })
        .populate("id_user", "fullName")
        .sort({ createdAt: -1 });

    // Lọc những review có order_detail hợp lệ
    return reviews.filter(review => review.id_order_detail !== null);
};

const getReviewedBooksService = async () => {
    try {
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
                    title: { $first: "$bookDetails.name" },
                    image: { $first: "$bookDetails.image" },
                    avgRating: { $avg: "$rating" },
                    // reviews: {
                    //     $push: {
                    //         comment: "$comment",
                    //         rating: "$rating",
                    //         user: "$id_user"
                    //     }
                    // }
                }
            },
            { $sort: { avgRating: -1 } }
        ]);

        return { success: true, data: reviewedBooks };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sách đã đánh giá", error);
        return { success: false, message: "Lỗi khi lấy dữ liệu" };
    }
};


module.exports = {
    createReviewService, getReviewedOrderDetails, getReviewsByBookService, getReviewedBooksService
}