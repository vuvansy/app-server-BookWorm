const {
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
    getTrendingProductsService,
    updateBookQuantityService,

} = require('../services/BookServices')



const getBookAPI = async (req, res) => {
    let { limit, page, name } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;

    const data = await getAllBookService(limit, page, name, req.query);

    if (!data) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi khi lấy danh sách sách",
            data: null
        });
    }

    if (limit && page) {
        return res.status(200).json({
            statusCode: 200,
            message: "Danh sách sách có phân trang",
            data: {
                meta: {
                    page,
                    limit,
                    pages: Math.ceil(data.total / limit),
                    total: data.total
                },
                result: data.result
            }
        });
    } else {
        return res.status(200).json({
            statusCode: 200,
            message: "Danh sách sách",
            data: data.result
        });
    }
};

const getBookByIdAPI = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const result = await getBookByIdService(id);

        return res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message || "Lấy chi tiết sách thành công!",
            data: result.data || null,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi server",
            error: error.message,
        });
    }
}

const postCreateBook = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                statusCode: 400,
                message: "Dữ liệu đầu vào không hợp lệ",
            });
        }

        let {
            id_genre,
            name,
            image,
            slider,
            price_old,
            price_new,
            quantity,
            description,
            weight,
            size,
            publishers,
            authors,
            year,
            page_count,
            book_cover
        } = req.body;


        const requiredFields = {
            id_genre,
            name,
            price_old,
            quantity,
            authors
        };
        const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                statusCode: 400,
                message: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
            });
        }

        let bookData = {
            id_genre,
            name,
            image,
            slider,
            price_old,
            price_new,
            quantity,
            description,
            weight,
            size,
            publishers,
            authors,
            year,
            page_count,
            book_cover
        }

        let result = await createBookService(bookData);
        return res.status(201).json({
            statusCode: 201,
            message: "Sách đã được tạo thành công",
            data: result,
        });

    } catch (error) {
        console.error("Lỗi tạo sách:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi server khi tạo sách",
            error: error.message,
        });
    }




}

const putUpdateBook = async (req, res) => {
    let { id } = req.params;
    let {
        id_genre,
        name,
        image,
        slider,
        price_old,
        price_new,
        quantity,
        description,
        weight,
        size,
        publishers,
        authors,
        year,
        page_count,
        book_cover
    } = req.body;
    // console.log(req.body);

    const requiredFields = ["id_genre", "name", "price_old", "quantity", "authors"];
    let missingFields = requiredFields.filter(field => req.body[field] === undefined);
    if (missingFields.length > 0) {
        return res.status(400).json({
            statusCode: 400,
            message: `Các trường bắt buộc còn thiếu: ${missingFields.join(", ")}`,
            error: "Bad Request"
        });
    }

    try {
        let result = await putUpdateBookService(id, id_genre, name, image, slider, price_old, price_new, quantity, description, weight, size, publishers, authors, year, page_count, book_cover);
        if (!result) {
            return res.status(400).json({
                statusCode: 400,
                message: `Book với id = ${id} không tồn tại trên hệ thống.`,
                error: "Bad Request"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật sản phẩm thành công!",
            data: result
        });
    } catch (error) {
        console.log("Controller error:", error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "Lỗi máy chủ, không thể cập nhật thể loại"
        });
    }
}

const deleteABook = async (req, res) => {
    let { id } = req.params;
    try {
        let result = await deleteABookService(id);
        if (!result) {
            return res.status(404).json({
                "statusCode": 404,
                "message": `Không tìm thấy Book với id = ${id} để xóa.`,
                "data": null
            });
        }

        return res.status(200).json({
            "statusCode": 201,
            "message": "Xóa Book thành công!",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            "statusCode": 500,
            "message": "Lỗi khi xóa Genre.",
            "error": error.message
        });
    }
}


const getFlashSaleBooks = async (req, res) => {
    try {
        const { page, limit, all, id_genre, sort } = req.query;
        const { result, meta } = await getFlashSaleBooksService({ page, limit, all, id_genre, sort });

        if (!all) {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách sách giảm giá",
                data: result
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sách giảm giá thành công!",
            data: {
                meta,
                result
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách flash sale:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ, không thể lấy danh sách sản phẩm.",
            error: error.message
        });
    }
};



const getBooksByGenreAPI = async (req, res) => {
    try {
        const id = req.params.id;
        const id_genre = req.params.id_genre;
        const authorIds = req.params.authorIds.split(','); // Giả sử bạn gửi nhiều authorIds, ví dụ: "authorId1,authorId2"

        if (!id_genre || !/^[0-9a-fA-F]{24}$/.test(id_genre)) {
            return res.status(400).json({
                message: "id_genre không hợp lệ",
                statusCode: 400,
                error: "Bad Request"
            });
        }

        
        const result = await getBooksByGenreService(id_genre, id, authorIds);

        return res.status(200).json({
            message: "Lấy danh sách sách liên quan thành công",
            statusCode: 200,
            data: result  
        });
    } catch (error) {
        console.error("Error fetching related books:", error);
        return res.status(500).json({
            message: "Lỗi server",
            statusCode: 500,
            error: "Internal Server Error"
        });
    }
};



const getNewBooksAPI = async (req, res) => {
    try {
        const { page, limit, all, id_genre, sort } = req.query;
        const { result, meta } = await getNewBooksService({ page, limit, all, id_genre, sort });
        if (!all) {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách sách",
                data: result
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sản phẩm mới thành công!",
            data: {
                meta,
                result
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách flash sale:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ, không thể lấy danh sách sản phẩm.",
            error: error.message
        });
    }
};


const searchBooksAPI = async (req, res) => {
    try {
        const { search } = req.query;

        const result = await searchBooksService(search);

        if (!result) {
            return res.status(500).json({
                statusCode: 500,
                message: "Lỗi khi tìm kiếm"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Tìm kiếm thành công",
            data: result
        });
    } catch (error) {
        console.error("Lỗi API:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getDeletedBooksAPI = async (req, res) => {
    let { limit, page, name } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;

    try {
        let data = await getDeletedBooksService(limit, page, name);
        if (!data) {
            return res.status(500).json({
                statusCode: 500,
                message: "Lỗi khi lấy danh sách sách đã xóa mềm",
                data: null
            });
        }

        if (limit && page) {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách sách đã xóa mềm có phân trang",
                data: {
                    meta: {
                        page,
                        limit,
                        pages: Math.ceil(data.total / limit),
                        total: data.total
                    },
                    result: data.result
                }
            });
        } else {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách sách đã xóa mềm",
                data: data.result
            });
        }
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ khi lấy danh sách sách đã xóa mềm",
            error: error.message
        });
    }
};

const restoreDeletedBookAPI = async (req, res) => {
    let { id } = req.params;

    try {
        const restoredBook = await restoreDeletedBookService(id);

        if (!restoredBook) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy sách với id = ${id} hoặc sách chưa bị xóa.`,
                data: null
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Khôi phục sách thành công!",
            data: restoredBook
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi server khi khôi phục sách.",
            error: error.message
        });
    }
};

const getTrendingBooks = async (req, res) => {
    try {
        const { page, limit, all, id_genre, sort } = req.query;

        const { result, meta } = await getTrendingProductsService({ page, limit, all, id_genre, sort });
        if (!all) {
            return res.status(200).json({
                statusCode: 200,
                message: "Danh sách sách",
                data: result
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sản phẩm xu hướng thành công!",
            data: {
                meta,
                result
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm xu hướng:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ, không thể lấy danh sách sản phẩm xu hướng.",
            error: error.message
        });
    }
};

const updateBookQuantityAPI = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { quantity } = req.body;

        if (!bookId || quantity === undefined) {
            return res.status(400).json({ message: "Thiếu thông tin bookId hoặc quantity!" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: "Số lượng nhập thêm phải lớn hơn 0!" });
        }

        const updatedBook = await updateBookQuantityService(bookId, quantity);

        if (!updatedBook.success) {
            return res.status(500).json({ message: updatedBook.message, error: updatedBook.error });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Nhập thêm số lượng sách thành công!",
            data: updatedBook.data
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi cập nhật số lượng sách",
            error: error.message
        });
    }
};




module.exports = {
    getBookAPI,
    postCreateBook,
    getBookByIdAPI,
    putUpdateBook,
    deleteABook,
    getFlashSaleBooks,
    getBooksByGenreAPI,
    getNewBooksAPI,
    searchBooksAPI,
    getDeletedBooksAPI,
    restoreDeletedBookAPI,
    getTrendingBooks,
    updateBookQuantityAPI

}