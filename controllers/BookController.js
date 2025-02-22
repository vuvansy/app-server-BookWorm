const {getAllBookService, createBookService, getBookByIdService} = require('../services/BookServices')


   const getBookAPI = async (req, res) => {
        let pageSize = req.query.pageSize; 
        let current = req.query.current; 
        let name = req.query.name;
        let result, total;

        if (pageSize && current) {
            ({ result, total } = await getAllBookService(pageSize, current, name));
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
            ({ result } = await getAllBookService());

            return res.status(200).json({
                statusCode: 200,
                message: "Fetch Books",
                data: result
            });
        }

       
        
    }

    const getBookByIdAPI = async(req, res) =>{
        try {
            const { id } = req.params;
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

    const postCreateBook = async(req, res) => {
        try {
            // Kiểm tra nếu không có body
            if (!req.body) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Dữ liệu đầu vào không hợp lệ",
                });
            }
        
        let {id_genre, name, image, slider, price_old,
            price_new,quantity,description, status, weight, 
            size, publishers, authors, year,page_count, book_cover} = req.body;

    
         const requiredFields = { id_genre, name, price_old ,price_new, quantity, authors };
         const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
 
         if (missingFields.length > 0) {
             return res.status(400).json({
                 statusCode: 400,
                 message: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
             });
         }

        let bookData = {
            id_genre, name, image, slider, price_old,
            price_new,quantity,description, status, weight, 
            size, publishers, authors, year,page_count, book_cover
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

module.exports = { 
    getBookAPI, postCreateBook, getBookByIdAPI 
}