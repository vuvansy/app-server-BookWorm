const genreModel = require("../models/GenreModels");
const bookModel = require("../models/BookModels");
const aqp = require('api-query-params');

const getAllGenreService = async (limit, page, name, queryString) => {
    try {
        let result = null;
        if (limit && page) {
            let offset = (page - 1) * limit;

            const { filter } = aqp(queryString);
            delete filter.page;

            Object.keys(filter).forEach(key => {
                if (typeof filter[key] === "string") {
                    filter[key] = { $regex: filter[key], $options: "i" };
                }
            });
            result = await genreModel
                .find(filter)
                .sort({ createdAt: -1 }) // Sắp xếp mới nhất đến cũ nhất
                .skip(offset)
                .limit(limit)
                .exec();
        } else {
            result = await genreModel.find({}).sort({ createdAt: -1 }); // Sắp xếp mặc định
        }

        const total = await genreModel.countDocuments({});
        return { result, total };

    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }

}

const createGenreService = async (genreData) => {
    try {
        let result = await genreModel.create({
            name: genreData.name,
            image: genreData.image
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createArrayGenreService = async (arrGenres) => {
    try {
        let validGenres = [];
        let failedGenre = [];

        for (let genre of arrGenres) {
            // Kiểm tra Genre đã tồn tại chưa
            const exists = await genreModel.findOne({ name: genre.name });

            if (exists) {
                failedGenre.push({ ...genre, reason: "genre đã tồn tại" });
            } else {
                validGenres.push(genre);
            }
        }

        // Genre không hợp lệ thì không thêm vào DB
        if (validGenres.length === 0) {
            return {
                success: false,
                message: "Không có genre nào được thêm mới!",
                addedCount: 0,
                failedCount: failedGenre.length,
                failedGenre
            };
        }

        // Add Genre DB
        const insertedGenres = await genreModel.insertMany(validGenres, { ordered: false });

        return {
            success: true,
            message: "Thêm mới thành công!",
            addedCount: insertedGenres.length,
            failedCount: failedGenre.length,
            failedGenre,
            data: insertedGenres
        };
    } catch (error) {
        console.log("error >>>> ", error);
        return { success: false, message: "Lỗi khi thêm genre!", error: error.message };
    }
}

const putUpdateGenreService = async (id, name, image) => {
    try {
        let result = await genreModel.findById(id);
        if (!result) {
            return null;
        }
        result.name = name ? name : result.name;
        result.image = image ? image : result.image;
        await result.save()
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
}


const deleteAGenreService = async (id) => {
    try {
        const bookCount = await bookModel.countDocuments({ id_genre: id });

        if (bookCount > 0) {
            throw new Error("Không thể xóa thể loại sách này.");
        }

        const result = await genreModel.deleteById(id);

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
    getAllGenreService, createGenreService, putUpdateGenreService, deleteAGenreService, createArrayGenreService
}