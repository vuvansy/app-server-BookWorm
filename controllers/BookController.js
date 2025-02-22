const {getAllBookService, createBookService} = require('../services/BookServices')


   const getBookAPI = async (req, res) => {
        let result = await getAllBookService();
        return res.status(200).json(
            {
                "statusCode": 200,
                "message": "API Books",
                data: result
            }
        )
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
    getBookAPI, postCreateBook 
}