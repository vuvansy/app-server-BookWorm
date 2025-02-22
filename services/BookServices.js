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

const getBookByIdService = async (id) => {
    try {
        const result = await bookModel.findById(id)
            .populate("id_genre", "name")
            .populate("authors");
            if (!result) {
                return { success: false, message: "Không tìm thấy sách", statusCode: 404 };
            }
    
            return { success: true, data: result, statusCode: 200 };
    } catch (error) {
        throw new Error(error.message);
    }
};

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
    getAllBookService, createBookService,  getBookByIdService
}