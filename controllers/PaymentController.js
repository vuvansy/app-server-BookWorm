const {
    createPaymentService, getAllPaymentService
} = require('../services/PaymentServices')

const postCreatePayment = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name === undefined) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin!" });
        }
        let data = { name }
        const result = await createPaymentService(data);
        return res.status(201).json({
            "statusCode": 201,
            "message": "",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error });
    }
}


const getPaymentAPI = async (req, res) => {
    try {
        const result = await getAllPaymentService();
        return res.status(200).json({
            "statusCode": 201,
            "message": "",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error });
    }
}


module.exports = {
    postCreatePayment, getPaymentAPI
}