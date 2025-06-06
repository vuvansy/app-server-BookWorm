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

            result = await userModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
        } else {
            result = await userModel.find({}).sort({ createdAt: -1 });
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
        if (!userData.type) {
            userData.type = "SYSTEM";
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
            password: userData.password,
            type: userData.type,
        });

        return result;
    } catch (error) {
        console.error("Lỗi khi tạo người dùng:", error.message);
        throw error;
    }
}

const updateUserService = async (id, userData) => {
    try {
        const { fullName, email, phone, image, role, password, confirm_password, address } = userData;

        const user = await userModel.findById(id);
        if (!user) {
            return { error: "Người dùng không tồn tại!" };
        }

        let newPassword = user.password;

        if (password && password.trim() !== "") {
            if (password !== confirm_password) {
                return { error: "Mật khẩu xác nhận không trùng khớp!" };
            }
            const salt = bcrypt.genSaltSync(10);
            newPassword = bcrypt.hashSync(password, salt);
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            {
                fullName: fullName || user.fullName,
                email: email || user.email,
                phone: phone || user.phone,
                role: role || user.role,
                address: address || user.address,
                image: image || user.image || "/avatar.jpg",
                password: newPassword,
            },
            { new: true }
        );

        return { data: updatedUser };
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error.message);
        throw new Error(error.message);
    }
};

const deleteUserService = async (id) => {
    try {
        let result = await userModel.deleteById(id);
        if (!result) {
            throw new Error("Không tồn tại người dùng này.");
        }
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
};

const blockUserService = async (id) => {
    const result = await userModel.findById(id);
    if (!result) {
        throw new Error("Người dùng không tồn tại");
    }

    // Đảo trạng thái khóa
    result.isBlocked = !result.isBlocked;
    await result.save();

    return result.isBlocked;
};

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

        const userData = {
            id: result._id,
            fullName: result.fullName,
            email: result.email,
            phone: result.phone,
            role: result.role,
            type: result.type,
            image: result.image || null,
            address: result.address
        };

        const access_token = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const refresh_token = jwt.sign(
            userData,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );
        return {
            message: "Đăng nhập thành công",
            statusCode: 200,
            data: {
                access_token,
                refresh_token,
                user: {
                    id: result._id,
                    fullName: result.fullName,
                    email: result.email,
                    phone: result.phone,
                    role: result.role,
                    type: result.type,
                    image: result.image,
                    address: result.address
                },
            },
        };

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

const forgotPasswordService = async (email) => {
    const user = await userModel.findOne({ email });
    if (!user) {
        return false;
    }

    const token = jwt.sign({ id: user._id }, "shhhhh", {
        expiresIn: 5 * 60,
    });
    user.reset_token = token;
    await user.save();
    return { token: token, fullName: user.fullName };

};

const resetPasswordService = async (token, password) => {
    const user = await userModel.findOne({ reset_token: token });
    console.log(user);
    if (!user) {
        return false;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.reset_token = null;
    await user.save();
    return true;

};

const changePasswordService = async (userId, current_password, new_password, confirm_password) => {
    try {

        if (!current_password || !new_password || !confirm_password) {
            return { success: false, status: 400, message: "Vui lòng nhập đầy đủ thông tin!" };
        }

        if (new_password !== confirm_password) {
            return { success: false, status: 400, message: "Mật khẩu mới và xác nhận mật khẩu không trùng khớp!" };
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return { success: false, status: 404, message: "Người dùng không tồn tại!" };
        }

        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return { success: false, status: 401, message: "Mật khẩu hiện tại không đúng!" };
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(new_password, salt);

        user.password = hashedPassword;
        await user.save();

        return { success: true, status: 200, message: "Mật khẩu đã được thay đổi thành công!" };
    } catch (error) {
        console.error("Lỗi đổi mật khẩu trong service:", error);
        return { success: false, status: 500, message: "Lỗi server khi đổi mật khẩu!" };
    }
};


const createArrayUserService = async (arrUsers) => {
    try {
        let validUsers = [];
        let failedUsers = [];

        const emails = arrUsers.map(user => user.email);
        const existingUsers = await userModel.find({ email: { $in: emails } });

        const existingEmails = new Set(existingUsers.map(user => user.email));

        for (let user of arrUsers) {
            if (existingEmails.has(user.email)) {
                failedUsers.push({ ...user, reason: "Email đã tồn tại" });
                continue;
            }

            user.address = user.address || {
                city: null,
                district: null,
                ward: null,
                street: "",
            };

            user.role = user.role || "USER";
            user.isBlocked = user.isBlocked !== undefined ? user.isBlocked : false;
            user.image = user.image || "/avatar.jpg";


            if (user.password) {
                const salt = bcrypt.genSaltSync(10);
                user.password = await bcrypt.hash(user.password, salt);
            }

            validUsers.push(user);
        }
        if (validUsers.length === 0) {
            return {
                success: false,
                statusCode: 400,
                message: "Không có user nào được thêm mới!",
                addedCount: 0,
                failedCount: failedUsers.length,
                failedUsers
            };
        }

        const insertedUsers = await userModel.insertMany(validUsers, { ordered: false });

        return {
            success: true,
            statusCode: 201,
            message: "Bulk Users",
            addedCount: insertedUsers.length,
            failedCount: failedUsers.length,
            failedUsers,
            data: insertedUsers
        };
    } catch (error) {
        console.log("Lỗi >>>>", error);
        return { success: false, statusCode: 500, message: "Lỗi khi thêm user!", error: error.message };
    }
};


const handleSocialMediaLoginService = async (email, type, fullName) => {
    let user = await userModel.findOne({ email });

    if (!user) {
        user = await userModel.create({
            fullName: fullName,
            email,
            phone: "",
            image: "/avatar.jpg",
            type: type,
            password: "",
            role: "USER",
            isBlocked: false
        });
    }

    if (user.isBlocked) {
        throw new Error("Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên!");
    }

    const payload = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        type: user.type,
        role: user.role,
        isBlocked: user.isBlocked,
        image: user.image,
    };

    const access_token = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );

    const refresh_token = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    return {
        access_token,
        refresh_token,
        user: {
            id: user._id,
            fullName: user.fullName || "",
            email: user.email,
            address: user.address || "",
            type: user.type,
            role: user.role,
            isBlocked: user.isBlocked || false,
            image: user.image,
        }
    };
};

const getUserByIdService = async (id) => {
    try {
        const user = await userModel.findById(id).select("-password"); // Ẩn mật khẩu

        if (!user) {
            return { error: "Người dùng không tồn tại!" };
        }

        return { data: user };
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.message);
        throw new Error(error.message);
    }
};


module.exports = {
    getAllUserService, createUserService, loginUserService, getUserByTokenService,
    updateUserService, blockUserService, deleteUserService, forgotPasswordService,
    resetPasswordService, changePasswordService, createArrayUserService, handleSocialMediaLoginService, getUserByIdService
}
