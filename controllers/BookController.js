const {
    getAllBookService,
    createBookService,
    getBookByIdService,
    putUpdateBookService,
    deleteABookService,
    getFlashSaleBooksService

} = require('../services/BookServices')


const getBookAPI = async (req, res) => {
    let pageSize = req.query.pageSize;
    let current = req.query.current;
    let name = req.query.name;
    let result, total;

    if (pageSize && current) {
        ({
            result,
            total
        } = await getAllBookService(pageSize, current, name));
        return res.status(200).json({
            statusCode: 200,
            message: "Fetch Books",
            data: {
                meta: {
                    current: current,
                    pageSize: pageSize,
                    pages: Math.ceil(total / pageSize),
                    total: total
                },
                result: result
            }
        });
    } else {
        ({
            result
        } = await getAllBookService());

        return res.status(200).json({
            statusCode: 200,
            message: "Fetch Books",
            data: result
        });
    }



}

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
        // Kiểm tra nếu không có body
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

    const requiredFields = ["id_genre", "name", "price_old", "quantity", "quantity", "authors"];
    let missingFields = requiredFields.filter(field => !req.body[field]);
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

// const getTopFlashSaleBooks = async (req, res) => {
//     try {
//         let { current, pageSize, all } = req.query;
//         let result, total;
//         if (pageSize && current) {
//             ({ result, total } = await getTopFlashSaleBooksService(pageSize, current, name));
//             return res.status(200).json({
//                 statusCode: 200,
//                 message: "Fetch Genre",
//                 data: {
//                     meta: {
//                         current: current,
//                         pageSize: pageSize,
//                         pages: Math.ceil(total / pageSize),
//                         total: total
//                     },
//                     result: result
//                 }
//             });
//         } else
//         ({ result } = await getTopFlashSaleBooksService());
//             return res.status(200).json(
//             {
//                 "statusCode": 201,
//                 "message": "",
//                 data: result
//             }
//         )
//     } catch (error) {
//         console.error("Lỗi khi lấy danh sách flash sale:", error);
//         return res.status(500).json({
//             statusCode: 500,
//             message: "Lỗi máy chủ, không thể lấy danh sách sản phẩm.",
//             error: error.message
//         });
//     }
// };

const getFlashSaleBooks = async (req, res) => {
    try {
        const { current, pageSize, all } = req.query;

        const { result, meta } = await getFlashSaleBooksService({ current, pageSize, all });

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách sách giảm giá thành công!",
            meta,
            data: result
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

module.exports = {
    getBookAPI,
    postCreateBook,
    getBookByIdAPI,
    putUpdateBook,
    deleteABook,
    getFlashSaleBooks
}