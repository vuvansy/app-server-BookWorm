const genreModel = require("../models/GenreModels");

const getAllGenreService = async (pageSize, current, name) => {
    try {
        let result = null;
        if (pageSize && current) {
            let offset = (current - 1) * pageSize; //Số lượng bản ghi bỏ qua
            if (name) {
                result = await genreModel.find(
                    {
                        "name": { $regex: name, $options: "i" }
                    }
                ).skip(offset).limit(pageSize).exec();
                // console.log(result);
            } else
                result = await genreModel.find({}).skip(offset).limit(pageSize).exec();
        } else {
            result = await genreModel.find({});
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
        let result = await genreModel.deleteById(id);
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
}

module.exports = {
    getAllGenreService, createGenreService, putUpdateGenreService, deleteAGenreService, createArrayGenreService
}