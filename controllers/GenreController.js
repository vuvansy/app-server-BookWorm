const {
    getAllGenreService, createGenreService, putUpdateGenreService, deleteAGenreService, createArrayGenreService
} = require('../services/GenreServices')


   const getGenreAPI = async (req, res) => {

        let pageSize = req.query.pageSize; 
        let current = req.query.current; 
        let name = req.query.name;
        let result, total;

        if (pageSize && current) {
            ({ result, total } = await getAllGenreService(pageSize, current, name));
            return res.status(200).json({
                statusCode: 200,
                message: "Fetch Genre",
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
        } else
        ({ result } = await getAllGenreService());
            return res.status(200).json(
            {
                "statusCode": 201,
                "message": "",
                data: result
            }
        )
   
    }

    const postCreateGenre = async(req, res) => {
        let { name, image } = req.body;
        if (!name || !image) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }
        let genreData = {
            name,
            image
        }
        // console.log(genreData);
        let result = await createGenreService(genreData);
        return res.status(200).json(
            {
                "statusCode": 201,
                "message": "",
                data: result
            }
        )
    }

    const  postCreateArrayGenre = async (req, res) => {
        // console.log(req.body);
        const arrGenres =  req.body.genres //req.body.genres data gửi lên
        if (!Array.isArray(arrGenres) || arrGenres.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "Danh sách sản phẩm không hợp lệ!",
            });
        }
        let result = await createArrayGenreService(req.body.genres);
        if (!result.success) {
            return res.status(400).json({
                statusCode: 400,
                message: result.message,
                data: {
                    countSuccess: result.addedCount,
                    countError: result.failedCount,
                    dataError: result.failedGenre
                }
            });
        }

        return res.status(201).json({
            statusCode: 201,
            message: result.message,
            data: {
                countSuccess: result.addedCount,
                countError: result.failedCount,
                dataSuccess: result.data,
                dataError: result.failedGenre
            }
        });

    }

   const putUpdateGenre = async (req, res) => {
        let { id } = req.params;
        let { name, image } = req.body;
        try {
        let result = await putUpdateGenreService(id, name, image);
        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: "Không tìm thấy Genre với ID"
            });
        }
        return res.status(200).json(
            {
                "statusCode": 201,
                "message": "Cập nhật thành Genre thành công!",
                data: result
            }
        );
    } catch (error) {
        console.log("Controller error:", error);
        return res.status(500).json({
            statusCode: 500,
            message: error.message || "Lỗi máy chủ, không thể cập nhật thể loại"
        });
    }
    }

    const deleteAGenre = async (req, res) => {
        let { id } = req.params;
        let result = await deleteAGenreService(id);
        return res.status(200).json(
            {
                "statusCode": 201,
                "message": "Xóa Genre thành công!",
                data: result
            }
        )
    }
    

module.exports = { 
    getGenreAPI, postCreateGenre, putUpdateGenre, deleteAGenre, postCreateArrayGenre
}