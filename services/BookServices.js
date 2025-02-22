const bookModel = require("../models/BookModels");

const getAllBookService = async (limit, page, name)=>{
    try {
        let result = null;
                if (limit && page) {
                    let offset = (page - 1) * limit;
                    if (name) {
                        result = await bookModel.find(
                            {
                                "name": { $regex: name, $options: "i" }
                            }
                        ).skip(offset).limit(limit).exec();
                    } else
                        result = await bookModel.find({}).skip(offset).limit(limit).exec();
                } else {
                    result = await bookModel.find({});
                }
                return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
   
}

const createBookService = async (bookData) => {
    try {
        let result = await bookModel.create({
            id_genre:bookData.id_genre,
            name: bookData.name,
            image: bookData.image,
            slider:bookData.slider,
            price_old:bookData.price_old,
            price_new:bookData.price_new,
            quantity:bookData.quantity,
            description:bookData.description,
            status:bookData.status,
            weight:bookData.weight,
            size:bookData.size,
            publishers:bookData.publishers,
            authors:bookData.authors,
            year:bookData.year,
            page_count:bookData.page_count,
            book_cover:bookData.book_cover,
       })
       return result;
    } catch (error) {
       console.log(error);
       return null;
    }
}

module.exports = {
    getAllBookService, createBookService
}