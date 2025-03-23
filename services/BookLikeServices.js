const bookLikeModel = require("../models/BookLikeModels");
const aqp = require('api-query-params');

const createBookLikeService = async (bookLike) => {
    try {
        // Kiểm tra xem đã tồn tại like hay chưa
        let existingLike = await bookLikeModel.findOne({
            id_user: bookLike.id_user,
            id_book: bookLike.id_book
        });

        if (existingLike) {
            return { status: 'exists', message: 'Người dùng đã thích cuốn sách này!' };
        }

        // Nếu chưa có, tạo mới
        let result = await bookLikeModel.create(bookLike);
        return { status: 'success', data: result };

    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Lỗi server, không thể thêm book like!' };
    }
};

const getBookLikesByUserService = async (id_user) => {
    try {
        if (!id_user) {
            throw new Error("Thiếu ID người dùng!");
        }
        const bookLikes = await bookLikeModel.find({ id_user }).populate("id_book");
        return bookLikes;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteABookLikeService = async (id) => {
    try {
        const result = await bookLikeModel.findByIdAndDelete(id);

        if (!result) {
            throw new Error("Thể loại không tồn tại hoặc không thể xóa.");
        }

        return result;
    } catch (error) {
        console.error("Lỗi trong deleteAGenreService:", error);
        throw error;
    }
};

module.exports = {
    createBookLikeService, getBookLikesByUserService, deleteABookLikeService
}