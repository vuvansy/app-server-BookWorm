const {getAllBookService} = require('../services/BookServices')


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

module.exports = { 
    getBookAPI 
}