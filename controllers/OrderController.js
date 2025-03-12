const {
    createOrderService
} = require('../services/OrderServices')

const postCreateOrder = async (req, res) => {
    try {
        const result = await createOrderService(req.body);

        if (!result.success) {
            return res.status(500).json({
                message: result.message,
                error: result.error,
            });
        }

        return res.status(201).json({
            statusCode: 200,
            message: "Đơn hàng được tạo thành công!",
            data: result.result
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng", error: error.message });
    }
};


module.exports = {
    postCreateOrder
}