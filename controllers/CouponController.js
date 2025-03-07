const {
    createCouponService, getAllCouponService
} = require('../services/CouponServices')



const getCouponAPI = async (req, res) => {

    let limit = req.query.limit;
    let page = req.query.page;
    let name = req.query.name;
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


module.exports = {
    postCreateCoupon, getCouponAPI
}