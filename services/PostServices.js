const postModel = require("../models/PostModels");
const aqp = require('api-query-params');


const getAllPostService = async (limit, page, queryString) => {
    try {
        const offset = limit && page ? (page - 1) * limit : 0;

        const { filter } = aqp(queryString);
        delete filter.page;

        // Tìm kiếm regex cho string (ngoại trừ status - để nguyên boolean)
        Object.keys(filter).forEach((key) => {
            if (typeof filter[key] === "string" && key !== 'status') {
                filter[key] = { $regex: filter[key], $options: "i" };
            }
        });

        const query = postModel.find(filter).sort({ createdAt: -1 });

        if (limit && page) {
            query.skip(offset).limit(limit);
        }

        const result = await query.exec();
        const total = await postModel.countDocuments(filter);

        return { result, total };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách post:", error);
        return null;
    }
};

const getPostByIdService = async (id) => {
    try {
      const result = await postModel.findById(id)
  
      if (!result) {
        return {
          statusCode: 400,
          message: `Post với id = ${id} không tồn tại trên hệ thống.`,
          error: "Bad Request",
        };
      }
  
      return {
        statusCode: 200,
        data: result
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

const createPostService = async (postData) => {
    try {
        const result = await postModel.create({
            title: postData.title,
            image: postData.image,
            excerpt: postData.excerpt,
            content: postData.content,
            status: postData.status,
        });
        return result;
    } catch (error) {
        console.error("Lỗi khi tạo post:", error);
        throw error;
    }
};

const putUpdatePostService = async (id, title, image, excerpt, content, status) => {
    try {
        let post = await postModel.findById(id);
        if (!post) {
            return null;
        }

        post.title = title ? title : post.title;
        post.image = image ? image : post.image;
        post.excerpt = excerpt ? excerpt : post.excerpt;
        post.content = content ? content : post.content;
        post.status = status !== undefined ? status : post.status;

        await post.save();
        return post;
    } catch (error) {
        console.error("Lỗi khi cập nhật bài viết:", error);
        return null;
    }
};


module.exports = {
    createPostService, getAllPostService, putUpdatePostService, getPostByIdService
}