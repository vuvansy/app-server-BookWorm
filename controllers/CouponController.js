const {
    createCouponService, getAllCouponService, getCouponByIdService, applyCouponService,
    updateCouponService, deleteCouponService, updateCouponStatusService
} = require('../services/CouponServices')



const getCouponAPI = async (req, res) => {

    let { limit, page, name } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;
    let result, total;

    if (limit && page) {
        ({ result, total } = await getAllCouponService(limit, page, name, req.query));
        return res.status(200).json({
            statusCode: 200,
            message: "Fetch coupon",
            data: {
                meta: {
                    page: page,
                    limit: limit,
                    pages: Math.ceil(total / limit),
                    total: total
                },
                result: result
            }
        });
    } else
        ({ result } = await getAllCouponService());
    return res.status(200).json(
        {
            "statusCode": 201,
            "message": "Fetch coupon",
            data: result
        }
    )

}

const postCreateCoupon = async (req, res) => {
    try {
        const { code, value, max_value, min_total, description, quantity, status, start_date, end_date } = req.body;

        if (!code || !value || !quantity || !status || !start_date || !end_date) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin!'
            });
        }

        const couponData = { code, value, max_value, min_total, description, quantity, status, start_date, end_date };
        const result = await createCouponService(couponData);

        if (!result.success) {
            return res.status(400).json({
                statusCode: 400,
                message: result.message
            });
        }

        return res.status(201).json({
            statusCode: 200,
            message: "Thêm mã giảm giá thành công!",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

const getCouponById = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const result = await getCouponByIdService(id);

        return res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message || "Lấy chi tiết Coupon thành công!",
            data: result.data || null,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi server",
            error: error.message,
        });
    }
}

const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        console.log(code);

        const result = await applyCouponService(code);

        return res.status(result.statusCode).json({
            statusCode: result.statusCode,
            message: result.message,
            data: result.data || null,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi server",
            error: error.message,
        });
    }
};

const updateCouponAPI = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, value, max_value, min_total, description, quantity, status, start_date, end_date } = req.body;

        if (!code || !value || !quantity || !status || !start_date || !end_date) {
            return res.status(400).json({
                statusCode: 400,
                message: "Vui lòng nhập đầy đủ thông tin!",
            });
        }

        const updateData = { code, value, max_value, min_total, description, quantity, status, start_date, end_date };

        const result = await updateCouponService(id, updateData);

        if (!result.success) {
            return res.status(400).json({ statusCode: 400, message: result.message });
        }

        return res.status(200).json({
            statusCode: 200,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: "Lỗi server!" });
    }
};

const deleteCouponAPI = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteCouponService(id);

        if (!result) {
            return res.status(404).json({
                statusCode: 404,
                message: `Không tìm thấy mã giảm giá với id ${id} để xóa.`,
                data: null,
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Xóa mã giảm giá thành công!",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad Request",
        });
    }
};

const updateCouponStatusAPI = async (req, res) => {
    try {
        const result = await updateCouponStatusService(req.params.id);
        const message =
            result === "active"
                ? "Mã giảm giá đã được kích hoạt"
                : "Mã giảm giá đã bị khóa";
        return res.status(200).json({
            statusCode: 200,
            message,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postCreateCoupon, getCouponAPI, getCouponById, applyCoupon,
    updateCouponAPI, deleteCouponAPI, updateCouponStatusAPI
}