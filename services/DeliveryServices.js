const deliveryModel = require("../models/DeliveryModels");
const aqp = require('api-query-params');


const createDeliveryService = async (data) => {
    try {
        let result = await deliveryModel.create({
            name: data.name,
            price: data.price
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllDeliveryService = async () => {
    return await deliveryModel.find()
}

module.exports = {
    getAllDeliveryService, createDeliveryService
}