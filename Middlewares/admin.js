const SEED = require("../config/config");


exports.verifyAdmin = function(req, res, next) {

    if (req.user.role === 'ADMIN_ROLE' || 'admin_role') {

        next()

    } else {
        res.status(401).json({
            ok: false,
            message: 'ACCESS DENIED'
        })
    }
}