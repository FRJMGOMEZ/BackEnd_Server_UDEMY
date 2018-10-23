const jwt = require("jsonwebtoken");
const SEED = require("../config/config");
const Hospital = require("../Models/hospital");

exports.getHospitalId = function(req, res, next) {
    if (req.body.hospital) {
        Hospital.findOne({ name: req.body.hospital }, (err, hospitalDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "THERE ARE PROBLEMS SEARCHING FOR AN HOSPITAL",
                    errors: err
                });
            }
            if (!hospitalDb) {
                return res.status(404).json({
                    ok: false,
                    message: "THESE NAME DOES NOT CORRESPOND WITH ANY HOSPITAL"
                });
            }
            req.hospitalId = hospitalDb._id;
            next();
        });
    } else {
        next();
    }
};