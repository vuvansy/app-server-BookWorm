const {
    getAllGenreService, createGenreService, putUpdateGenreService, deleteAGenreService
} = require('../services/GenreServices')


   const getGenreAPI = async (req, res) => {

        let limit = req.query.limit; 
        let page = req.query.page; 
        let name = req.query.name;
        let result = null;

        if (limit && page) {
            result = await getAllGenreService(limit, page, name);
        } else
            result = await getAllGenreService();
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
    getGenreAPI, postCreateGenre, putUpdateGenre, deleteAGenre
}