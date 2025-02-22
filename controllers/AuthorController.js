const {
    getAllAuthorService, createAuthorService
} = require('../services/AuthorServices')


   const getAuthorAPI = async (req, res) => {

        let limit = req.query.limit; 
        let page = req.query.page; 
        let name = req.query.name;
        let result = null;

        if (limit && page) {
            result = await getAllAuthorService(limit, page, name);
        } else
            result = await getAllAuthorService();
            return res.status(200).json(
            {
                "statusCode": 201,
                "message": "",
                data: result
            }
        )
   
    }

    const postCreateAuthor = async(req, res) => {
        let { name } = req.body;
        if (!name ) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }
        let genreData = {
            name
        }
        // console.log(genreData);
        let result = await createAuthorService(genreData);
        return res.status(200).json(
            {
                "statusCode": 201,
                "message": "",
                data: result
            }
        )
    }

 

    

module.exports = { 
    getAuthorAPI, postCreateAuthor
}