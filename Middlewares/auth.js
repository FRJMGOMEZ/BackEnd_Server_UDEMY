const jwt = require("jsonwebtoken");
const SEED = require("../config/config");

exports.verifyToken = function(req, res, next) {

    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: "INVALID TOKEN",
                errors: err
            });
        }
        req.user = decoded.userDb || decoded.userSaved;
        next();
    });
}