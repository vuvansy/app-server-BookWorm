const {
    createDeliveryService, getAllDeliveryService
} = require('../services/DeliveryServices')

const postCreateDelivery = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin!" });
        }
        let data = { name, price }
        const result = await createDeliveryService(data);
        return res.status(201).json({
            "statusCode": 201,
            "message": "",
            "data": result
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error });
    }
}


const getDeliveryAPI = async (req, res) => {
    try {
        const result = await getAllDeliveryService();
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
    getDeliveryAPI, postCreateDelivery
}