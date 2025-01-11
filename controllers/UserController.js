const {getAllUserService} = require('../services/UserServices')

const getUsersAPI = async (req, res) => {
    let result = await getAllUserService();
    return res.status(200).json(
        {
            "statusCode": 200,
            "message": "Fetch users",
            data: result
        }
    )
}


module.exports = {
    getUsersAPI
}