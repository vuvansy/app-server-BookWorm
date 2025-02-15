const {getAllGenreService, createGenreService} = require('../services/GenreServices')


   const getGenreAPI = async (req, res) => {
        let result = await getAllGenreService();
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

    

module.exports = { 
    getGenreAPI, postCreateGenre
}