const orderDetailModel = require("../models/OrderDetailModels");
const aqp = require('api-query-params');

const createOrderDetailService = async (orderDetail) => {
    try {
        let result = await orderDetailModel.create({
            id_book: orderDetail.id_book,
            id_order: orderDetail.id_order,
            quantity: orderDetail.quantity,
            price: orderDetail.price
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createOrderDetailService
}