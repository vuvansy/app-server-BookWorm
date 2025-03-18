const {
    createBookLikeService, getBookLikesByUserService, deleteABookLikeService
} = require('../services/BookLikeServices')

const postCreateBookLike = async (req, res) => {
    let { id_user, id_book } = req.body;
    if (!id_user || !id_book) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    let bookLike = {
        id_user,
        id_book
    }
    // console.log(bookLike);
    let result = await createBookLikeService(bookLike);
    return res.status(200).json(
        {
            "statusCode": 201,
            "message": "",
            data: result
        }
    )
}

const getBookLikesByUser = async (req, res) => {
    try {
        const { id_user } = req.params;
        const bookLikes = await getBookLikesByUserService(id_user);

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sách yêu thích thành công!",
            data: bookLikes
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sách yêu thích:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ!",
            error: error.message
        });
    }
};

const deleteABookLike = async (req, res) => {
    let { id } = req.params;

    console.log(id);
    try {
        let result = await deleteABookLikeService(id);

        if (!result) {
            return res.status(404).json({
                "statusCode": 404,
                "message": `Không tìm thấy book like với id ${id} để xóa.`,
                "data": null
            });
        }

        return res.status(200).json({
            "statusCode": 200,
            "message": "Xóa Book like thành công!",
            "data": result
        });
    } catch (error) {
        return res.status(400).json({
            "statusCode": 400,
            "message": error.message, // Trả về message từ Error
            "error": "Bad Request"
        });
    }
}

module.exports = {
    postCreateBookLike, getBookLikesByUser, deleteABookLike
}