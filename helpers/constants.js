require("dotenv").config();
const getConstants = () => {
    return {
        HOST: process.env.PORT,
        MAIL: process.env.MAIL,
        APP_PASSWORD: process.env.APP_PASSWORD,
    };
};

module.exports = { getConstants };
