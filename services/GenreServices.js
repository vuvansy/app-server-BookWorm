const genreModel = require("../models/GenreModels");

const getAllGenreService = async (limit, page, name) => {
    try {
        let result = null;
        if (limit && page) {
            let offset = (page - 1) * limit; //Số lượng bản ghi bỏ qua
            if (name) {
                result = await genreModel.find(
                    {
                        "name": { $regex: '.*' + name + '.*' }
                    }
                ).skip(offset).limit(limit).exec();
                console.log(result);
            } else
                result = await genreModel.find({}).skip(offset).limit(limit).exec();
        } else {
            result = await genreModel.find({});
        }

        return result;

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
    getAllGenreService, createGenreService, putUpdateGenreService, deleteAGenreService
}