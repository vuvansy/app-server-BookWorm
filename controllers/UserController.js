const { getAllUserService, createUserService,
    loginUserService, getUserByTokenService,
    updateUserService, blockUserService, deleteUserService
} = require('../services/UserServices')


const getUsersAPI = async (req, res) => {

    let { limit, page } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;
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

const deleteUser = async (req, res) => {
    let { id } = req.params;
    try {
        let result = await deleteUserService(id);
        if (!result) {
            return res.status(404).json({
                "statusCode": 404,
                "message": `Không tìm thấy User với id = ${id} để xóa.`,
                "data": null
            });
        }

        return res.status(200).json({
            "statusCode": 200,
            "message": "Xóa User thành công!",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            "statusCode": 500,
            "message": "Lỗi khi xóa User.",
            "error": error.message
        });
    }
};

const updateUserAPI = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateUserService(id, req.body);

        if (result.error) {
            return res.status(400).json({
                statusCode: 400,
                message: result.error,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật người dùng thành công!",
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi máy chủ!",
            error: error.message,
        });
    }
};

const blockUserAPI = async (req, res) => {
    try {
        const result = await blockUserService(req.params.id);
        return res.status(200).json({
            "statusCode": 201,
            "message": `Người dùng đã ${result ? "bị khóa" : "được mở khóa"}`,
            "data": result
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const loginUserAPI = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(
                {
                    "message": "Unauthorized",
                    "statusCode": 401
                }
            )
        }
        const result = await loginUserService(email, password);

        return res.status(200).json(result);
    } catch (error) {
        console.error("API Login Error:", error);
        return res.status(500).json({ statusCode: 500, message: "Lỗi server" });
    }

}

const getUserAccount = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const result = await getUserByTokenService(token);
        return res.status(200).json({
            statusCode: 200,
            message: "Get Account",
            data: {
                user: result
            }
        });

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Server Error" });
    }
};

const logoutUserAPI = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            "message": "Đăng xuất thành công!",
            "statusCode": 201,
            "data": "Logout success.",
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi đăng xuất", error: error.message });
    }
};

module.exports = {
    getUsersAPI, postCreateUserAPI, loginUserAPI, getUserAccount, logoutUserAPI,
    updateUserAPI, blockUserAPI, deleteUser
}

