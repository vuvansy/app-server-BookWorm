const {
    createPostService, getAllPostService, 
    putUpdatePostService, getPostByIdService
} = require('../services/PostServices')

const getPostAPI = async (req, res) => {
    let { limit, page } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;

    try {
        let result, total;

        if (limit && page) {
            ({ result, total } = await getAllPostService(limit, page, req.query));
            return res.status(200).json({
                statusCode: 200,
                message: "Lấy danh sách bài viết thành công!",
                data: {
                    meta: {
                        page,
                        limit,
                        pages: Math.ceil(total / limit),
                        total
                    },
                    result
                }
            });
        } else {
            ({ result } = await getAllPostService());
            return res.status(200).json({
                statusCode: 200,
                message: "Lấy tất cả bài viết thành công!",
                data: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy danh sách bài viết!",
            error: error.message
        });
    }
};

const getPostByIdAPI = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getPostByIdService(id);
  
      return res.status(result.statusCode).json({
          statusCode: result.statusCode,
          message: result.message || "Lấy chi tiết bài viết thành công!",
          data: result.data || null
        });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Lỗi server",
        error: error.message
      });
    }
  };

const postCreatePost = async (req, res) => {
    const { title, image, excerpt, content, status } = req.body;

    if (!title || !excerpt || !content) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc!' });
    }

    const postData = {
        title,
        image,
        excerpt,
        content,
        status: status ?? true, 
    };

    try {
        const result = await createPostService(postData);
        return res.status(201).json({
            statusCode: 201,
            message: 'Tạo bài viết thành công',
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi tạo bài viết!',
            error: error.message,
        });
    }
};

const putUpdatePostAPI = async (req, res) => {
    const { id } = req.params;
    const { title, image, excerpt, content, status } = req.body;

    try {
        const result = await putUpdatePostService(id, title, image, excerpt, content, status);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy bài viết với ID = ${id}`
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: 'Cập nhật bài viết thành công!',
            data: result
        });

    } catch (error) {
        console.log("Controller error:", error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message || 'Lỗi máy chủ, không thể cập nhật bài viết'
        });
    }
};


module.exports = {
    postCreatePost, getPostAPI, putUpdatePostAPI, getPostByIdAPI
}