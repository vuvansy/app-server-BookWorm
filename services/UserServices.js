const userModel = require("../models/UserModels");
const aqp = require('api-query-params');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

        if (result.isBlocked) {
            return {
                message: "Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên!",
                error: "Forbidden",
                statusCode: 403
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
            const userData = {
                id: result._id,
                fullName: result.fullName,
                email: result.email,
                phone: result.phone,
                role: result.role,
                image: result.image || null,
                address: result.address
            };

            // Tạo access_token với userData
            const access_token = jwt.sign(
                userData,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
            );

            // Chỉ lưu id vào refresh_token để giảm kích thước token
            const refresh_token = jwt.sign(
                { id: result._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
            );
            return {
                message: "Đăng nhập thành công",
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
                        image: result.image,
                        address: result.address
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

const getUserByTokenService = async (token) => {
    try {
        if (!token) throw { status: 401, message: "Unauthorized" };

        const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!result) throw { status: 403, message: "Invalid token" };

        return result;
    } catch (error) {
        throw error;
    }
};



module.exports = {
    getAllUserService, createUserService, loginUserService, getUserByTokenService
}
