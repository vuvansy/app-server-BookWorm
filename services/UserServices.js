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

module.exports = {
    getAllUserService
}
