const bookModel = require("../models/BookModels");

const getAllBookService = async (current, pageSize, name)=>{
    try {
        let result = null;
                if (current && pageSize) {
                    let offset = (pageSize - 1) * current;
                    if (name) {
                        result = await bookModel.find(
                            {
                                "name": { $regex: name, $options: "i" }
                            }
                        ).skip(offset).limit(current).exec();
                    } else
                        result = await bookModel.find({}).skip(offset).limit(current).exec();
                } else {
                    result = await bookModel.find({});
                }
                const total = await bookModel.countDocuments({});
                return { result, total };
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
                return {
                    message: `Book với id = ${id} không tồn tại trên hệ thống.`,
                    error: "Bad Request",
                    statusCode: 400
                };
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