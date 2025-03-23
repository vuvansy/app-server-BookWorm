const bookModel = require("../models/BookModels");
const aqp = require('api-query-params');
const mongoose = require("mongoose");


const getAllBookService = async (limit, page, name, queryString) => {
    try {
        let result = null;
        let filter = {};
        const parsedQuery = aqp(queryString);
        const queryFilter = parsedQuery.filter || {};
        const querySort = parsedQuery.sort || {};

        delete queryFilter.page;

        // 🔹 Lọc theo thể loại (genre)
        if (queryString.id_genre) {
            let genres = Array.isArray(queryString.id_genre)
                ? queryString.id_genre
                : queryString.id_genre.split(",");

            genres = genres.map(id => new mongoose.Types.ObjectId(id));
            filter.id_genre = { $in: genres };
        }

        // 🔹 Lọc theo tên sách (name)
        if (queryFilter.name) {
            filter.name = { $regex: queryFilter.name, $options: 'i' };
        }

        // 🔹 Lọc theo giá (price)
        if (queryFilter.price_min || queryFilter.price_max) {
            filter.price_new = {};
            if (queryFilter.price_min) {
                filter.price_new.$gte = Number(queryFilter.price_min);
            }
            if (queryFilter.price_max) {
                filter.price_new.$lte = Number(queryFilter.price_max);
            }
        }

        // 🔹 Lọc theo tác giả (authors)
        if (queryString.authors) {
            let authors = Array.isArray(queryString.authors)
                ? queryString.authors
                : queryString.authors.split(",");

            authors = authors.map(id => new mongoose.Types.ObjectId(id));
            filter.authors = { $in: authors };
        }

        // 🔹 Sắp xếp dữ liệu
        let sort = {};
        if (queryString.sort) {
            let sortField = queryString.sort;
            if (sortField.startsWith('-')) {
                sortField = sortField.substring(1);
                sort[sortField] = -1;
            } else {
                sort[sortField] = 1;
            }
        } else {
            sort = { createdAt: -1 };
        }

        // 🔹 Lấy danh sách sách theo phân trang hoặc toàn bộ
        if (page && limit) {
            let offset = (page - 1) * limit;
            result = await bookModel.find(filter)
                .skip(offset)
                .limit(limit)
                .sort(sort)
                .populate("id_genre", "name")
                .populate("authors", "name")
                .exec();
        } else {
            result = await bookModel.find(filter)
                .sort(sort)
                .populate("id_genre", "name")
                .populate("authors", "name")
                .exec();
        }

        const total = await bookModel.countDocuments(filter);
        return { result, total };
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
};

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

const putUpdateBookService = async (id, id_genre, name, image, slider, price_old, price_new, quantity, description, weight, size, publishers, authors, year, page_count, book_cover) => {
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
        result.quantity = quantity !== undefined ? quantity : result.quantity;
        result.description = description ? description : result.description;
        result.weight = weight ? weight : result.weight;
        result.size = size ? size : result.size;
        result.authors = authors ? authors : result.authors;
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

const getFlashSaleBooksService = async ({ current, pageSize, all }) => {
    try {
        current = parseInt(current) || 1;
        pageSize = parseInt(pageSize) || 10;
        const offset = (current - 1) * pageSize;

        let booksQuery = [
            { $match: { price_new: { $gt: 0 }, price_old: { $gt: 0 } } },
            {
                $addFields: {
                    discount: {
                        $multiply: [
                            { $divide: [{ $subtract: ["$price_old", "$price_new"] }, "$price_old"] },
                            100
                        ]
                    }
                }
            },
            { $sort: { discount: -1 } },
        ];

        if (!all) {
            booksQuery.push({ $limit: 10 });
        } else {
            booksQuery.push({ $skip: offset }, { $limit: pageSize });
        }

        let result = await bookModel.aggregate(booksQuery);

        let totalBooks = 0;
        if (all) {
            totalBooks = await bookModel.countDocuments({ price_new: { $gt: 0 }, price_old: { $gt: 0 } });
        }

        return {
            result,
            meta: all ? {
                current: current,
                pageSize: pageSize,
                total: totalBooks,
                pages: Math.ceil(totalBooks / pageSize)
            } : null
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getBooksByGenreService = async (id_genre, id) => {
    try {
        const query = { id_genre };
        if (id) {
            query._id = { $ne: id };
        }
        const result = await bookModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(10);
        return result;
    } catch (error) {
        console.error("Error in getBooksByGenreService:", error);
        throw new Error("Lỗi lấy danh sách sách liên quan");
    }
};

const getNewBooksService = async ({ page, limit, all, id_genre, sort }) => {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const matchStage = {};
        if (id_genre) {
            matchStage.id_genre = new mongoose.Types.ObjectId(id_genre)
        }

        // Bước 2: Xác định kiểu sắp xếp
        let sortStage = { createdAt: -1 }; // Mặc định sắp xếp theo ngày tạo
        if (sort) {
            const isDescending = sort.startsWith("-");
            const sortField = isDescending ? sort.substring(1) : sort;
            const sortOrder = isDescending ? -1 : 1;

            // Chỉ cho phép sắp xếp theo price_new hoặc name
            if (["price_new", "name"].includes(sortField)) {
                sortStage = { [sortField]: sortOrder };
            }
        }

        const booksQuery = [
            { $match: matchStage },
            { $sort: sortStage },
        ];

        if (all) {
            booksQuery.push({ $skip: offset }, { $limit: limit });
        } else {
            booksQuery.push({ $limit: 10 });
        }
        const result = await bookModel.aggregate(booksQuery);

        if (!all) {
            return { result };
        }

        let totalBooks = 0;
        if (all) {
            totalBooks = await bookModel.countDocuments(matchStage);
        }
        return {
            result,
            meta: {
                page,
                limit,
                total: totalBooks,
                pages: Math.ceil(totalBooks / limit)
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const searchBooksService = async (searchQuery) => {
    try {
        if (!searchQuery) return [];
        const regex = new RegExp(searchQuery, "i");
        const result = await bookModel.aggregate([
            {
                $lookup: {
                    from: "genres",
                    localField: "id_genre",
                    foreignField: "_id",
                    as: "genre"
                }
            },
            { $unwind: "$genre" },

            {
                $lookup: {
                    from: "authors",
                    localField: "authors",
                    foreignField: "_id",
                    as: "authorData"
                }
            },
            {
                $match: {
                    $or: [
                        { name: regex },
                        { "genre.name": regex },
                        { "authorData.name": regex },
                        { publishers: regex }
                    ]
                }
            },

            { $limit: 5 },
            {
                $project: {
                    genre: 0,
                    authorData: 0
                }
            }
        ]);

        return result;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        return null;
    }
};

const getDeletedBooksService = async (limit, page, name) => {
    try {

        let query = bookModel.findDeleted(); // Chỉ lấy sách đã xóa mềm
        if (name) {
            query = query.where("name", new RegExp(name, "i")); // Tìm kiếm không phân biệt hoa thường
        }
        // Xử lý phân trang nếu có
        if (limit && page) {
            let offset = (page - 1) * limit;
            query = query.skip(offset).limit(limit);
        }

        let result = await query
            .sort({ deletedAt: -1 })
            .populate("id_genre", "name")
            .populate("authors", "name")
            .exec();

        const total = await bookModel.countDocumentsDeleted(
            name ? { name: new RegExp(name, "i") } : {}
        );

        return { result, total };
    } catch (error) {
        console.log("Lỗi khi lấy danh sách sách đã xóa mềm >>>>", error);
        return null;
    }
};

const restoreDeletedBookService = async (id) => {
    try {
        const book = await bookModel.findOneWithDeleted({ _id: id });

        if (!book || !book.deleted) {
            return null;
        }

        // Khôi phục sách
        await book.restore();

        return book;
    } catch (error) {
        console.log("Error restoring book:", error);
        return null;
    }
};


const getTrendingProductsService = async ({ page, limit, all, id_genre, sort }) => {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;
        const matchStage = {};
        if (id_genre) {
            matchStage.id_genre = new mongoose.Types.ObjectId(id_genre);
        }

        let trendingQuery = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "order_details",
                    localField: "_id",
                    foreignField: "id_book",
                    as: "order_data"
                }
            },
            {
                $addFields: {
                    total_sold: { $sum: "$order_data.quantity" }
                }
            },

            {
                $lookup: {
                    from: "orders",
                    localField: "order_data.id_order",
                    foreignField: "_id",
                    as: "order_info"
                }
            },
            {
                $addFields: {
                    latest_order_date: { $max: "$order_info.createdAt" }
                }
            },

            {
                $addFields: {
                    is_new: {
                        $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 15))]
                    }
                }
            }
        ];

      
        let sortStage = { total_sold: -1, latest_order_date: -1, is_new: -1 }; // Mặc định
        if (sort) {
            const isDescending = sort.startsWith("-");
            const sortField = isDescending ? sort.substring(1) : sort;
            const sortOrder = isDescending ? -1 : 1;

            if (["price_new", "name"].includes(sortField)) {
                sortStage = { [sortField]: sortOrder };
            }
        }

        trendingQuery.push({ $sort: sortStage });

        if (all) {
            trendingQuery.push({ $skip: offset }, { $limit: limit });
        } else {
            trendingQuery.push({ $limit: 10 });
        }

       
        let result = await bookModel.aggregate(trendingQuery);
        let response = { result };

        if (all) {
            let totalBooks = await bookModel.countDocuments(matchStage);
            response.meta = {
                page,
                limit,
                total: totalBooks,
                pages: Math.ceil(totalBooks / limit)
            };
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};



module.exports = {
    getAllBookService,
    createBookService,
    getBookByIdService,
    putUpdateBookService,
    deleteABookService,
    getFlashSaleBooksService,
    getBooksByGenreService,
    getNewBooksService,
    searchBooksService,
    getDeletedBooksService,
    restoreDeletedBookService,
    getTrendingProductsService
}