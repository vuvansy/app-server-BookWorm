const {
    createOrderDetailService
} = require('../services/OrderDetailServices')

const postCreateOrderDetail = async (req, res) => {
    try {
        let { quantity, price, id_book, id_order } = req.body;
        if (!quantity || !price || !id_book || !id_order) {
            return res.status(400).json(
                {
                    message: 'Vui lòng nhập đầy đủ thông tin!'

                });
        }

        const orderDetail = { quantity, price, id_book, id_order }
        const result = await createOrderDetailService(orderDetail);

        if (!result) {
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

module.exports = {
    postCreateOrderDetail
}