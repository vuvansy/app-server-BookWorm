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

module.exports = {
    getAllAuthorService, createAuthorService, updateAuthorService,
    deleteAuthorService
}