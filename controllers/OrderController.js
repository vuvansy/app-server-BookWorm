const {
    createOrderService, getOrdersByUserService, getOrderDetailByIdService,
    updateOrderStatusService, updateOrderPaymentStatusService,
    getOrdersService
} = require('../services/OrderServices')

const getOrdersAPI = async (req, res) => {
    let { limit, page, status } = req.query;
    limit = limit ? Number(limit) : null;
    page = page ? Number(page) : null;

    const data = await getOrdersService(limit, page, status, req.query);

    if (!data) {
        return res.status(500).json({
            statusCode: 500,
            message: "Lỗi khi lấy danh sách đơn hàng",
            data: null
        });
    }

    if (limit && page) {
        return res.status(200).json({
            statusCode: 200,
            message: "Danh sách đơn hàng có phân trang",
            data: {
                meta: {
                    page,
                    limit,
                    pages: Math.ceil(data.total / limit),
                    total: data.total,
                    statusCounts: data.statusCounts
                },
                result: data.result
            }
        });
    } else {
        return res.status(200).json({
            statusCode: 200,
            message: "Danh sách đơn hàng",
            data: data.result,
        });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const { id_user } = req.params;
        const { status } = req.query;

        const result = await getOrdersByUserService(id_user, status);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy danh sách đơn hàng thành công!",
            data: {
                meta: {
                    statusCounts: result.statusCounts
                },
                result: result.data,
            }
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

const updateOrderPaymentStatus = async (req, res) => {
    try {
        const { orderId, isPaid } = req.body;

        const result = await updateOrderPaymentStatusService(orderId, isPaid);

        if (!result.success) {
            return res.status(400).json({ message: result.message, error: result.error });
        }

        return res.status(200).json({ message: result.message, order: result.order });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống khi cập nhật thanh toán", error: error.message });
    }
};



module.exports = {
    postCreateOrder, getOrdersByUser, getOrderDetailById,
    updateOrderStatus, updateOrderPaymentStatus, getOrdersAPI
}