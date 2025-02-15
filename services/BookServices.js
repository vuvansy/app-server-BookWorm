const bookModel = require("../models/BookModels");

const getAllBookService = async ()=>{
    try {
        const result = await bookModel.find({});
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
   
}

module.exports = {
    getAllBookService
}