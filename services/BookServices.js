const bookModel = require("../models/BookModels");

const getAllBookService = async (current, pageSize, name) => {
    try {
        let result = null;
        if (current && pageSize) {
            let offset = (pageSize - 1) * current;
            if (name) {
                result = await bookModel.find({
                    "name": {
                        $regex: name,
                        $options: "i"
                    }
                }).skip(offset).limit(current).exec();
            } else
                result = await bookModel.find({}).skip(offset).limit(current).exec();
        } else {
            result = await bookModel.find({});
        }
        const total = await bookModel.countDocuments({});
        return {
            result,
            total
        };
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

        return {
            success: true,
            data: result,
            statusCode: 200
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const createBookService = async (bookData) => {
    try {
        let result = await bookModel.create({
            id_genre: bookData.id_genre,
            name: bookData.name,
            image: bookData.image,
            slider: bookData.slider,
            price_old: bookData.price_old,
            price_new: bookData.price_new,
            quantity: bookData.quantity,
            description: bookData.description,
            weight: bookData.weight,
            size: bookData.size,
            publishers: bookData.publishers,
            authors: bookData.authors,
            year: bookData.year,
            page_count: bookData.page_count,
            book_cover: bookData.book_cover,
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const putUpdateBookService = async (id, id_genre, name, image, slider, price_old, price_new, quantity, description, status, weight, size, publishers, authors, year, page_count, book_cover) => {
    try {
        let result = await bookModel.findById(id);
        if (!result) {
            return null;
        }
        result.id_genre = id_genre ? id_genre : result.id_genre;
        result.name = name ? name : result.name;
        result.image = image ? image : result.image;
        result.slider = slider ? slider : result.slider;
        result.price_old = price_old ? price_old : result.price_old;
        result.price_new = price_new !== undefined ? Number(price_new) : result.price_new;
        result.quantity = quantity ? quantity : result.quantity;
        result.description = description ? description : result.description;
        result.status = status !== undefined ? Number(status) : result.status;
        result.weight = weight ? weight : result.weight;
        result.publishers = publishers ? publishers : result.publishers;
        result.year = year ? year : result.year;
        result.page_count = page_count ? page_count : result.page_count;
        result.book_cover = book_cover ? book_cover : result.book_cover;
      
        await result.save()
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
}

const deleteABookService = async (id) => {
    try {
        let result = await bookModel.deleteById(id);
        if (!result) {
            throw new Error("Genre không tồn tại hoặc không thể xóa.");
        }
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
}

module.exports = {
    getAllBookService,
    createBookService,
    getBookByIdService,
    putUpdateBookService,
    deleteABookService
}