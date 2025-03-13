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

module.exports = {
    createOrderDetailService
}