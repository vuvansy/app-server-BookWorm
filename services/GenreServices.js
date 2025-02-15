const genreModel = require("../models/GenreModels");

const getAllGenreService = async () => {
    try {
        const result = await genreModel.find({});
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

module.exports = {
    getAllGenreService, createGenreService
}