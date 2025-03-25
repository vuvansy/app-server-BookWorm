const mailer = require("nodemailer");
const getConstants = require("../helpers/constants").getConstants;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { getAllUserService, createUserService,
    loginUserService, getUserByTokenService,
    updateUserService, blockUserService, deleteUserService,
    forgotPasswordService, resetPasswordService, changePasswordService,
    createArrayUserService
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

const postCreateArrayUser = async (req, res) => {
    const arrUsers = req.body.users; // Lấy danh sách users từ request body
    if (!Array.isArray(arrUsers) || arrUsers.length === 0) {
        return res.status(400).json({
            statusCode: 400,
            message: "Danh sách user không hợp lệ!",
        });
    }

    let result = await createArrayUserService(arrUsers);
    if (!result.success) {
        return res.status(400).json({
            statusCode: 400,
            message: result.message,
            data: {
                countSuccess: result.addedCount,
                countError: result.failedCount,
                dataError: result.failedUsers
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
            dataError: result.failedUsers
        }
    });
};


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
            return res.status(400).json({
                message: "Thiếu email hoặc mật khẩu!",
                statusCode: 400
            });
        }

        const result = await loginUserService(email, password);
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).json(result);
        }
        // Lưu refresh_token vào HTTP-Only Cookie
        res.cookie("refresh_token", result.data.refresh_token, {
            httpOnly: true,
            secure: true, // Chỉ gửi qua HTTPS khi deploy
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        return res.status(200).json({
            message: "Đăng nhập thành công!",
            statusCode: 200,
            data: {
                access_token: result.data.access_token,
                user: result.data.user
            }
        });
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

const forgotPasswordAPI = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
    }

    const result = await forgotPasswordService(email);
    if (!result) {
        return res.status(200).json({
            statusCode: 404,
            message: "Email không tồn tại trong hệ thống."
        });
    }

    const { token, fullName } = result;

    if (token && fullName) {
        const mailOptions = {
            from: getConstants().MAIL, //Gửi từ mail nào
            to: email, //Gửi đến mail nào
            subject: "🔐 Đặt lại mật khẩu của bạn",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center;">
                    <h2 style="color: #007BFF;">🔑 Yêu cầu đặt lại mật khẩu</h2>
                    <p style="color: #333;">Xin chào <strong>${fullName}</strong>,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                    <a href="${process.env.CLIENT_URL}/reset-password?token=${token}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 20px 0;">
                       🔄 Đặt lại mật khẩu
                    </a>
                    <p style="color: #777; font-size: 14px;">Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
                    <hr style="margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">© 2025 BookWorm. Mọi quyền được bảo lưu.</p>
                </div>
            </div>
        `,
        };
        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({
                "statusCode": 201,
                "message": "Email đã được gửi thành công!"
            });
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            return res.status(500).json({ message: "Gửi email thất bại!" });
        }
    }
    return res.status(500).json({ message: "Có lỗi xảy ra!" });
};

const resetPasswordAPI = async (req, res) => {
    try {
        const { password, confirm_password, token } = req.body;
        if (!password || !confirm_password || !token) {
            return res.status(400).json({
                statusCode: 400,
                message: "Thiếu dữ liệu đầu vào!"
            });
        }
        if (password !== confirm_password) {
            return res.status(400).json({
                statusCode: 400,
                message: "Mật khẩu và xác nhận mật khẩu không trùng khớp!"
            });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, "shhhhh");
        } catch (error) {
            return res.status(401).json({
                statusCode: 400,
                message: "Token không hợp lệ hoặc đã hết hạn!"
            });
        }
        if (decoded && decoded.id) {
            const result = await resetPasswordService(token, password);
            if (result) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Mật khẩu đã được cập nhật thành công!"
                });
            } else {
                return res.status(404).json({
                    statusCode: 200,
                    message: "Không tìm thấy user hoặc token không hợp lệ!"
                });
            }
        }

        return res.status(400).json({
            statusCode: 400,
            message: "Dữ liệu không hợp lệ!"
        });

    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi server khi đặt lại mật khẩu!"
        });
    }
};

const changePasswordAPI = async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const userId = req.user.id; // Lấy userId từ token đã xác thực
        // console.log(userId);
        const result = await changePasswordService(userId, current_password, new_password, confirm_password);

        if (result.success) {
            return res.status(200).json({
                statusCode: 200,
                message: result.message
            });
        } else {
            return res.status(result.status).json({
                statusCode: 400,
                message: result.message
            });
        }
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        return res.status(500).json({ success: false, message: "Lỗi server khi đổi mật khẩu!" });
    }
};

//send email
const transporter = mailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: getConstants().MAIL,
        pass: getConstants().APP_PASSWORD,

    },

});

module.exports = {
    getUsersAPI, postCreateUserAPI, loginUserAPI, getUserAccount, logoutUserAPI,
    updateUserAPI, blockUserAPI, deleteUser, forgotPasswordAPI, resetPasswordAPI,
    changePasswordAPI, postCreateArrayUser
}

