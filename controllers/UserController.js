const {getAllUserService, createUserService} = require('../services/UserServices')
const path = require('path');

module.exports = {

    getUsersAPI: async (req, res) => {
        let result = await getAllUserService();
        return res.status(200).json(
            {
                "statusCode": 200,
                "message": "Fetch users",
                data: result
            }
        )
    },

    postCreateUserAPI:async(req, res)=>{
        let { fullName, phone, email, address, role, password } = req.body;

        // Kiểm tra nếu không có file được upload
    if (!req.file) {
        return res.status(400).json({ error: 'Hình ảnh là bắt buộc.' });
      }
       // Lấy đường dẫn file đã upload
    const folderName = req.headers['upload-type'] || 'default';
    const imageUrl = `/images/${folderName}/${req.file.filename}`

        let userData = {fullName, phone, email, image: imageUrl, address, role, password}
        // console.log(userData);
        let result = await createUserService(userData);
        return res.status(200).json(
            {
               "statusCode": 201,
               "message": "Create a users",
                data: result
            }
        )
    },

}

