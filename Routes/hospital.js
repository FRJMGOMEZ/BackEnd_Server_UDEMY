const express = require("express");
const Hospital = require('../Models/hospital');

const verifyToken = require('../Middlewares/auth').verifyToken;

const verifyAdmin = require('../Middlewares/admin').verifyAdmin;

const getHospitalId = require('../Middlewares/getHospitalId').getHospitalId;

const app = express();

app.get("/", (req, res) => {

    Hospital.find({})
        .populate({ path: "user", select: "name" })
        .exec((err, hospitals) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        message: "ERROR LOADING HOSPITALS",
                        errors: err
                    });
            }
            res.status(200).json({ ok: true, hospitals });
        })
})

app.post("/", [verifyToken, verifyAdmin], (req, res) => {

    let body = req.body;

    let hospital = new Hospital({
        name: body.name,
        img: body.img,
        users: [],
    });

    let date = new Date()
    let stringDate = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

    let userTimeStamp = { id: req.user._id, date: stringDate, message: "Creation" };

    hospital.users.push(userTimeStamp)

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "ERROR SAVING HOSPITAL",
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            hospitalSaved
        });
    });
});

app.put('/:id', [verifyToken, verifyAdmin], (req, res) => {

    let body = req.body;

    let id = req.params.id;

    Hospital.findById(id, (err, hospitalDb) => {
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "ERROR SAVING HOSPITAL",
                    errors: err
                });
        }
        if (!hospitalDb) {

            return res.status(404).json({
                ok: false,
                message: 'THERE ARE NO HOSPITAL WITH THE ID TYPED'
            })
        }

        let date = new Date();
        let stringDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

        let userTimeStamp = { id: req.user._id, date: stringDate, message: "Modification" };
        if (hospitalDb.users.length = 3) {
            hopitalDb.users[0] = hospitalDb.users[1];
            hospitalDb.users[1] = hospitalDb.users[2];
            hospitalDb.users[2] = hospitalTimeStamp;
        } else {
            hospitalDb.users.push(userTimeStamp)
        }

        hospitalDb.name = body.name;

        if (body.img) {
            hospitalDb.img = body.img;
        }

        hospitalDb.save((err, hospitalSaved) => {

            if (err) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        message: "CHANGES COULD NOT BEEN ADDED",
                        errors: err
                    });
            }

            res.status(200).json({
                ok: true,
                message: 'CHANGES SUCCESFULLY SAVED',
                hospitalSaved
            })
        })
    })
})

app.delete("/:id", [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "CHANGES COULD NOT BEEN DELETED",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            message: "HOSPITAL SUCCESFULLY DELETED",
            hospitalDeleted
        });
    });
});

module.exports = app;