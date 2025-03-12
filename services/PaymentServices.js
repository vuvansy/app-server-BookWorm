const paymentModel = require("../models/PaymentModels");
const aqp = require('api-query-params');


const createPaymentService = async (data) => {
    try {
        let result = await paymentModel.create({
            name: data.name,
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllPaymentService = async () => {
    return await paymentModel.find()
}

module.exports = {
    getAllPaymentService, createPaymentService
}