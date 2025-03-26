const authorModel = require("../models/AuthorModels");

const getAllAuthorService = async (limit, page, name) => {
    try {
        let filter = {};
        let offset = 0;
        if (page && limit) {
            offset = (page - 1) * limit;
        }
        const result = await authorModel.find(filter)
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
        const total = await authorModel.countDocuments();

        return { result, total };

    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }

}

const createAuthorService = async (authorData) => {
    try {
        let result = await authorModel.create({
            name: authorData.name,
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateAuthorService = async (id, name) => {
    try {
        let result = await authorModel.findById(id);
        if (!result) {
            return null;
        }

        result.name = name;
        await result.save();

        return result;
    } catch (error) {
        console.error("Lỗi trong updateAuthorService:", error);
        throw error;
    }
};

const deleteAuthorService = async (id) => {
    try {
        let author = await authorModel.deleteById(id);
        if (!author) {
            return null;
        }
        return author;
    } catch (error) {
        console.error("Lỗi trong deleteAuthorService:", error);
        throw error;
    }
};

const createArrayAuthorService = async (arrAuthors) => {
    try {
        let validAuthors = [];
        let failedAuthors = [];

        const names = arrAuthors.map(author => author.name);
        const existingAuthors = await authorModel.find({ name: { $in: names } });

        const existingNames = new Set(existingAuthors.map(author => author.name));

        for (let author of arrAuthors) {
            if (existingNames.has(author.name)) {
                failedAuthors.push({ ...author, reason: "Tên tác giả đã tồn tại" });
                continue;
            }

            validAuthors.push(author);
        }

        if (validAuthors.length === 0) {
            return {
                success: false,
                statusCode: 400,
                message: "Không có tác giả nào được thêm mới!",
                addedCount: 0,
                failedCount: failedAuthors.length,
                failedAuthors
            };
        }

        const insertedAuthors = await authorModel.insertMany(validAuthors, { ordered: false });

        return {
            success: true,
            statusCode: 201,
            message: "Bulk Authors",
            addedCount: insertedAuthors.length,
            failedCount: failedAuthors.length,
            failedAuthors,
            data: insertedAuthors
        };
    } catch (error) {
        console.log("Lỗi >>>>", error);
        return { success: false, statusCode: 500, message: "Lỗi khi thêm tác giả!", error: error.message };
    }
};


module.exports = {
    getAllAuthorService, createAuthorService, updateAuthorService,
    deleteAuthorService, createArrayAuthorService
}