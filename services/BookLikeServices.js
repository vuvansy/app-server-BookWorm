const bookLikeModel = require("../models/BookLikeModels");
const aqp = require('api-query-params');

const createBookLikeService = async (bookLike) => {
    try {
        let result = await bookLikeModel.create({
            id_user: bookLike.id_user,
            id_book: bookLike.id_book
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

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
        const result = await bookLikeModel.deleteById(id);

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