const couponModel = require("../models/CouponModels");
const aqp = require('api-query-params');


const getAllCouponService = async (limit, page, name, queryString) => {
    try {
        let result = null;
        if (limit && page) {
            let offset = (page - 1) * limit;

            const { filter } = aqp(queryString);
            delete filter.page;

            Object.keys(filter).forEach(key => {
                if (typeof filter[key] === "string") {
                    filter[key] = { $regex: filter[key], $options: "i" };
                }
            });

            result = await couponModel.find(filter).skip(offset).limit(limit).exec();
        } else {
            result = await couponModel.find({});
        }

        const total = await couponModel.countDocuments({});
        return { result, total };

    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }

}

const createCouponService = async (couponData) => {
    try {
        const existingCoupon = await couponModel.findOne({ code: couponData.code });
        if (existingCoupon) {
            return {
                success: false,
                message: 'Mã giảm giá đã tồn tại!'
            };
        }

        const result = await couponModel.create({
            code: couponData.code,
            value: couponData.value,
            max_value: couponData.max_value,
            min_total: couponData.min_total,
            description: couponData.description,
            quantity: couponData.quantity,
            status: couponData.status,
            start_date: couponData.start_date,
            end_date: couponData.end_date
        });

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Có lỗi xảy ra khi thêm mã giảm giá!'
        };
    }
};

const getCouponByIdService = async (id) => {
    try {
        const result = await couponModel.findById(id)
        if (!result) {
            return {
                message: `Coupon với id = ${id} không tồn tại trên hệ thống.`,
                error: "Bad Request",
                statusCode: 400
            };
        }

        return {
            success: true,
            data: result,
            statusCode: 200
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const applyCouponService = async (code) => {
    try {
        const result = await couponModel.findOne({ code });

        if (!result) {
            return {
                message: "Mã giảm giá không hợp lệ!",
                error: "Bad Request",
                statusCode: 400
            };
        }

        const now = new Date();
        if (result.start_date && now < result.start_date) {
            return {
                message: "Mã giảm giá chưa được kích hoạt!",
                error: "Bad Request",
                statusCode: 400
            };
        }
        if (result.end_date && now > result.end_date) {
            return {
                message: "Mã giảm giá đã hết hạn!",
                error: "Bad Request",
                statusCode: 400
            };
        }
        // Kiểm tra số lượt sử dụng
        if (result.quantity <= 0) {
            return {
                message: "Mã giảm giá đã hết lượt sử dụng!",
                error: "Bad Request",
                statusCode: 400
            };
        }

        return {
            success: true,
            message: "Mã giảm giá hợp lệ!",
            data: result,
            statusCode: 200
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createCouponService, getAllCouponService, getCouponByIdService, applyCouponService
}