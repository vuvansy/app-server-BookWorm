const userModel = require("../models/UserModels");

const getAllUserService = async ()=>{
    try {
        const result = await userModel.find({});
        return result;
    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
   
}
const createUserService = async(userData)=>{
    try {
        let result = await userModel.create({
            fullName: userData.fullName,
            phone: userData.phone,
            email: userData.email,
            role: userData.role,
            address: userData.address,
            image: userData.image,
            password: userData.password
        })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    getAllUserService, createUserService
}
