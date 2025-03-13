const orderDetailModel = require("../models/OrderDetailModels");
const aqp = require('api-query-params');

const createOrderDetailService = async (orderDetails) => {
    try {
        let result = await orderDetailModel.insertMany(orderDetails);
        return { success: true, data: result };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Lỗi khi tạo đơn hàng chi tiết", error };
    }
};

const getOrderDetailsByOrderIdService = async (id_order) => {
    try {
        const result = await orderDetailModel.find({ id_order }).populate("id_book");

        if (!result.length) {
            return { success: false, message: "Không tìm thấy chi tiết đơn hàng!" };
        }

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Lỗi hệ thống", error: error.message };
    }
};

module.exports = {
    createOrderDetailService, getOrderDetailsByOrderIdService
}