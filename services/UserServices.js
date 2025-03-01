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
            console.log(filter);
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

module.exports = {
    getAllUserService, createUserService
}
