const express = require("express");
const Doctor = require('../Models/doctor');

const verifyToken = require("../Middlewares/auth").verifyToken;

const verifyAdmin = require("../Middlewares/admin").verifyAdmin;

const getHospitalId = require("../Middlewares/getHospitalId").getHospitalId;

const app = express();


app.get('/', (req, res) => {
    Doctor.find({})
        .populate({ path: "hospital", select: "name" })
        .populate({ path: "user", select: "name" })
        .exec((err, doctors) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        message: "ERROR SAVING DOCTOR",
                        errors: err
                    });
            }
            if (!doctors) {
                return res
                    .status(204)
                    .json({
                        ok: true,
                        message: "THERE ARE NO DOCTORS IN DB"
                    });
            }
            return res.status(200).json({ ok: true, doctors });
        });
})

app.post('/', [verifyToken, verifyAdmin, getHospitalId, ], (req, res) => {

    let body = req.body;
    let hospitalId = req.hospitalId;
    let userId = req.user._id;

    let doctor = new Doctor({
        name: body.name,
        img: body.img,
        users: [],
        hospital: hospitalId
    })

    let date = new Date();
    let stringDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

    let userTimeStamp = { id: userId, date: stringDate, message: "Creation" };

    doctor.users.push(userTimeStamp);

    doctor.save((err, doctorSaved) => {

        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "ERROR SAVING DOCTOR",
                    errors: err
                });
        }
        return res.status(200).json({
            ok: true,
            doctorSaved
        })
    })
})

app.put("/:id", [verifyToken, getHospitalId, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let hospitalId = req.hospitalId;
    let userId = req.user._id;
    Doctor.findById(id, (err, doctorDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "ERROR SEARCHING DOCTOR",
                errors: err
            });
        }
        if (!doctorDb) {
            return res.status(404).json({
                ok: false,
                message: "THERE ARE NO DOCTORS WITH THIS ID"
            });
        }

        let date = new Date();
        let stringDate = `${date.getFullYear()}/${date.getMonth() +
      1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

        let userTimeStamp = { id: userId, stringDate, message: "Modification" };

        if ((doctorDb.users.length = 3)) {
            doctorDb.users[0] = doctorDb.users[1];
            doctorDb.users[1] = doctorDb.users[2];
            doctorDb.users[2] = userTimeStamp;
        } else {
            userDb.users.push(userTimeStamp);
        }

        if (body.name) {
            doctorDb.name = body.name;
        }
        if (hospitalId) {
            doctorDb.hospital = hospitalId;
        }
        doctorDb.user = userId;

        doctorDb.save((err, doctorSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "ERROR SAVING DOCTOR",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                doctorSaved
            });
        });
    });
});

app.delete("/:id", [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;

    Doctor.findByIdAndDelete(id, (err, doctorDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "ERROR DELETING DOCTOR",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            doctorDeleted
        });
    });
});

module.exports = app;