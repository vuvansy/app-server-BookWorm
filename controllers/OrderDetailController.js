const {
    createOrderDetailService, getOrderDetailsByOrderIdService
} = require('../services/OrderDetailServices')

const postCreateOrderDetail = async (req, res) => {
    try {
        const orderDetails = req.body;
        if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        for (const item of orderDetails) {
            if (!item.quantity || !item.price || !item.id_book || !item.id_order) {
                return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin trong mỗi sản phẩm!' });
            }
        }
        const result = await createOrderDetailService(orderDetails);

        if (!result.success) {
            return res.status(500).json({
                message: result.message,
                error: result.error,
            });
        }


        return res.status(201).json({
            statusCode: 200,
            message: "Đơn hàng được tạo thành công!",
            data: result
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng", error: error.message });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id_order } = req.params;

        if (!id_order) {
            return res.status(400).json({ message: "Thiếu id_order!" });
        }

        const result = await getOrderDetailsByOrderIdService(id_order);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Lấy chi tiết đơn hàng thành công!",
            data: result.data,
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};


module.exports = {
    postCreateOrderDetail, getOrderDetails
}