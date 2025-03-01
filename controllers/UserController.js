const { getAllUserService, createUserService } = require('../services/UserServices')


const getUsersAPI = async (req, res) => {
    
        let limit = req.query.limit;
        let page = req.query.page;
        let fullName = req.query.fullName;
        let result, total;

        if (limit && page) {
            ({ result, total } = await getAllUserService(limit, page, fullName, req.query));
            return res.status(200).json({
                statusCode: 200,
                message: "Fetch Users with Pagination",
                data: {
                    meta: {
                        page,
                        limit,
                        pages: Math.ceil(total / limit),
                        total
                    },
                    result
                }
            });
        } else {
            ({ result, total } = await getAllUserService());
            return res.status(200).json({
                statusCode: 200,
                message: "Fetch All Users",
                data: result
            });
        }
    
}

const postCreateUserAPI = async (req, res) => {
    try {
        let { fullName, email, phone, image, role, password, confirm_password, address } = req.body;
        let userData = { fullName, email, phone, image, role, password, confirm_password, address }

        let result = await createUserService(userData);
        if (result.error) {
            return res.status(400).json({
                statusCode: 400,
                message: result.error
            });
        }
        return res.status(200).json(
            {
                "statusCode": 201,
                "message": "Thêm mới người dùng thành công",
                data: result
            });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: error.message
        });
    }
}

module.exports = {
    getUsersAPI, postCreateUserAPI
}

