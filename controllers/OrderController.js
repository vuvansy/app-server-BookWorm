const {
    createOrderService, getOrdersByUserService, getOrderDetailByIdService,
    updateOrderStatusService
} = require('../services/OrderServices')


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

const getOrderDetailById = async (req, res) => {
    try {
        const { id_order } = req.params;
        const result = await getOrderDetailByIdService(id_order);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy thông tin đơn hàng thành công!",
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy thông tin đơn hàng",
            error: error.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id_order } = req.params;
        const { status } = req.body;

        if (![0, 1, 2, 3, 4].includes(status)) {
            return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ!" });
        }

        const result = await updateOrderStatusService(id_order, status);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Cập nhật trạng thái đơn hàng thành công!",
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống khi cập nhật trạng thái đơn hàng",
            error: error.message,
        });
    }
};

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
    postCreateOrder, getOrdersByUser, getOrderDetailById,
    updateOrderStatus
}