const {
    createOrderService, getOrdersByUserService
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

const getOrdersByUser = async (req, res) => {
    try {
        const { id_user } = req.params;
        const result = await getOrdersByUserService(id_user);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách đơn hàng thành công!",
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy danh sách đơn hàng",
            error: error.message,
        });
    }
};

module.exports = {
    postCreateOrder, getOrdersByUser
}