const {
    getAllAuthorService, createAuthorService, updateAuthorService,
    deleteAuthorService
} = require('../services/AuthorServices')


const getAuthorAPI = async (req, res) => {
    try {
        let { limit, page, name } = req.query;
        limit = limit ? Number(limit) : null;
        page = page ? Number(page) : null;

        const data = await getAllAuthorService(limit, page, name);
        if (!data) {
            return res.status(500).json({
                statusCode: 500,
                message: "Lỗi khi lấy danh sách tác giả",
                data: null
            });
        }
        if (limit && page) {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách tác giả có phân trang",
                data: {
                    meta: {
                        page,
                        limit,
                        pages: Math.ceil(data.total / limit),
                        total: data.total
                    },
                    result: data.result
                }
            });
        } else {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách tác giả",
                data: data.result
            });
        }
    } catch (error) {
        console.error("Error in getAuthorAPI:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Đã xảy ra lỗi khi lấy danh sách tác giả",
            data: null
        });
    }

}

const postCreateAuthor = async (req, res) => {
    let { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    let authorData = {
        name
    }
    let result = await createAuthorService(authorData);
    return res.status(200).json(
        {
            "statusCode": 201,
            "message": "",
            data: result
        }
    )
}

const updateAuthorAPI = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                statusCode: 400,
                message: "Trường 'name' là bắt buộc!",
                error: "Bad Request"
            });
        }

        const result = await updateAuthorService(id, name);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: `Tác giả với ID = ${id} không tồn tại.`,
                error: "Not Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật tác giả thành công!",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "Lỗi máy chủ, không thể cập nhật tác giả"
        });
    }
};

const deleteAuthorAPI = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAuthor = await deleteAuthorService(id);

        if (!deletedAuthor) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy tác giả với ID = ${id} để xóa.`,
                data: null
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Xóa tác giả thành công!",
            data: deletedAuthor
        });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi khi xóa tác giả.",
            error: error.message
        });
    }
};


module.exports = {
    getAuthorAPI, postCreateAuthor,
    updateAuthorAPI, deleteAuthorAPI
}