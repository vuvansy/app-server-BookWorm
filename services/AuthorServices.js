const authorModel = require("../models/AuthorModels");

const getAllAuthorService = async (limit, page, name) => {
    try {
        let result = null;
        if (limit && page) {
            let offset = (page - 1) * limit; //Số lượng bản ghi bỏ qua
            if (name) {
                result = await authorModel.find(
                    {
                        "name": { $regex: '.*' + name + '.*' }
                    }
                ).skip(offset).limit(limit).exec();
                // console.log(result);
            } else
                result = await authorModel.find({}).skip(offset).limit(limit).exec();
        } else {
            result = await authorModel.find({});
        }

        return result;

    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
   
}

const createAuthorService = async (genreData) => {
    try {
        let result = await authorModel.create({
        name: genreData.name,
       })
       return result;
    } catch (error) {
       console.log(error);
       return null;
    }
}


module.exports = {
    getAllAuthorService, createAuthorService,
}