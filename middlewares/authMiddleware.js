const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // console.log("token: ", token);
            const data = jwt.verify(token, "shhhhh");
            // console.log("data: ", data);
            req.user = data;
            // console.log(req.user);
            next();
        } else {
            res.status(401).json({ error: "Not authoried!!" });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = authMiddleware;
