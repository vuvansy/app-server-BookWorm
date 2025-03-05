const userModel = require("../models/UserModels");
const aqp = require('api-query-params');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUserService = async (limit, page, fullName, queryString) => {
    try {
        let result = null;
        // console.log(page, limit);

        if (limit && page) {
            let offset = (page - 1) * limit; //Số lượng bản ghi bỏ qua
            const { filter } = aqp(queryString);
            delete filter.page;

            Object.keys(filter).forEach(key => {
                if (typeof filter[key] === "string") {
                    filter[key] = { $regex: filter[key], $options: "i" };
                }
            });

            result = await userModel.find(filter).skip(offset).limit(limit).exec();
        } else {
            result = await userModel.find({});
        }

        const total = await userModel.countDocuments({});

        return {
            result,
            total
        };
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }

}

const createUserService = async (userData) => {
    try {
        if (userData.password !== userData.confirm_password) {
            return { error: "Mật khẩu xác nhận không trùng khớp!" };
        }
        const existingUser = await userModel.findOne({ email: userData.email });
        if (existingUser) {
            return { error: "Email đã tồn tại!" };
        }
        if (!userData.image) {
            userData.image = "/avatar.jpg";
        }

        const salt = bcrypt.genSaltSync(10);
        userData.password = bcrypt.hashSync(userData.password, salt);

        const result = await userModel.create({
            fullName: userData.fullName,
            phone: userData.phone,
            email: userData.email,
            role: userData.role,
            address: userData.address,
            image: userData.image,
            password: userData.password
        });

        return result;
    } catch (error) {
        console.error("Lỗi khi tạo người dùng:", error.message);
        throw error;
    }
}

const loginUserService = async (email, password) => {
    try {
        const result = await userModel.findOne({ email });

        if (!result) {
            return {
                message: "Thông tin đăng nhập không chính xác",
                error: "Bad Request",
                statusCode: 400
            };
        }
        const isMatch = bcrypt.compareSync(password, result.password);
        if (!isMatch) {
            return {
                message: "Thông tin đăng nhập không chính xác",
                error: "Bad Request",
                statusCode: 400
            };
        }

        if (result && bcrypt.compareSync(password, result.password)) {
            const access_token = jwt.sign({ result }, "shhhhh", {
                expiresIn: 1 * 60,
            });
            const refresh_token = jwt.sign({ result }, "shhhhh", {
                expiresIn: 90 * 24 * 60 * 60,
            });
            // access token là chuỗi ngẫu nhiên, dùng để xác thực người dùng
            // refresh token là chuỗi ngẫu nhiên, dùng để lấy lại access token
            return {

                message: "Login",
                statusCode: 201,
                data: {
                    access_token,
                    refresh_token,
                    user: {
                        id: result._id,
                        fullName: result.fullName,
                        email: result.email,
                        phone: result.phone,
                        role: result.role,
                        avatar: result.avatar,
                    },
                },
            };
        } else {
            res.json({
                status: 300,
                message: "Sai tên đăng nhập hoặc mật khẩu",
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return { status: 500, message: "Lỗi server" };
    }
}

module.exports = {
    getAllUserService, createUserService, loginUserService
}
