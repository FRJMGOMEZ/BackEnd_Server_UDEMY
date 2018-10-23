const express = require('express');
const fileUpload = require("express-fileupload");
const fs = require('fs');

const verifyToken = require("../Middlewares/auth").verifyToken;
const verifyAdmin = require('../Middlewares/admin').verifyAdmin;

const User = require('../Models/user');
const Hospital = require('../Models/hospital');
const Doctor = require('../Models/doctor');

const app = express();
app.use(
    fileUpload({})
);

app.put('/:type/:id', [verifyToken, verifyAdmin], (req, res, next) => {

    let id = req.params.id;
    let type = req.params.type;
    let userId = req.user._id;

    let validTypes = ['hospitals', 'doctors', 'users']

    if (!req.files) {
        return res
            .status(400)
            .json({
                ok: false,
                message: "THERE ARE NOT FILES TO BE UPLOADED"
            });
    }

    if (validTypes.indexOf(type) < 0) {

        return res
            .status(400)
            .json({
                ok: false,
                message: "THE COLLECTION DOES NOT EXIST"
            });
    }


    let file = req.files.img;

    let cuttedFile = file.name.split('.');

    //res.json({ file })

    let fileExt = cuttedFile[cuttedFile.length - 1];

    let allowedExt = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowedExt.indexOf(fileExt) < 0) {
        return res
            .status(400)
            .json({
                ok: false,
                message: "FILE EXTENSION NOT VALID",
                error: 'FILE EXT MUST BE png, jpg, gif or jpeg'
            })
    }

    let personalizedName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;

    let path = `./uploads/${type}/${personalizedName}`;


    file.mv(path, (err, fileSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        uploadByType(type, id, userId, personalizedName, res)
    })
})


function uploadByType(type, id, userId, fileName, res) {

    if (type === 'users') {

        User.findById(id, (err, userDb) => {

            if (err) {
                return res
                    .status(404)
                    .json({ ok: false, message: "ERROR SEARCHING USER" });
            }

            if (!userDb) {

                return res.status(400).json({
                    ok: false,
                    message: 'USER DOES NOT EXIST'
                })
            }

            let oldPath = `uploads/users/${userDb.img}`;

            let userTimeStamp;

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                userTimeStamp = { id: userId, date: new Date().getDate(), message: "Modification IMG" };
            } else {
                userTimeStamp = { id: userId, date: new Date().getDate(), message: "Creation IMG" };
            }
            if (userDb.users.length = 3) {
                userDb.users[0] = userDb.users[1];
                userDb.users[1] = userDb.users[2];
                userDb.users[2] = userTimeStamp
            } else {
                userDb.users.push(userTimeStamp);
            }

            userDb.img = fileName;

            userDb.save((err, userUpdated) => {

                if (err) {
                    return res
                        .status(500)
                        .json({
                            ok: false,
                            err
                        });
                }

                userUpdated.password = '=)';

                return res.json({
                    ok: true,
                    message: 'USER IMG UPDATED',
                    userUpdated
                })
            })
        })
    }
    if (type === "hospital") {
        Hospital.findById(id, (err, hospitalDb) => {

            if (err) {
                return res
                    .status(500)
                    .json({ ok: false, message: "ERROR SEARCHING HOSPITAL" });
            }

            if (!hospitalDb) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        message: "HOSPITAL DOES NOT EXIST"
                    });
            }

            let oldPath = `uploads/hospitals/${hospitalDb.img}`;

            let userTimeStamp;

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                userTimeStamp = { id: userId, date: new Date().getDate(), message: "Modification IMG" };
            } else {
                userTimeStamp = { id: userId, date: new Date().getDate(), message: "Creation IMG" };
            }

            if (hospitalDb.users.length = 3) {
                hospitalDb.users[0] = hospitalDb.users[1];
                hospitalDb.users[1] = hospitalDb.users[2];
                hospitalDb.users[2] = userTimeStamp;
            } else {
                hospitalDb.users.push(userTimeStamp);
            }

            hospitalDb.img = fileName;

            hospitalDb.save((err, hospitalUpdated) => {
                if (err) {
                    return res.status(500).json({ ok: false, err });
                }
                return res.json({
                    ok: true,
                    message: "HOSPITAL IMG UPDATED",
                    hospitalUpdated
                });
            });
        });
    }
    if (type === "doctors") {
        Doctor.findById(id, (err, doctorDb) => {
            if (err) {
                return res
                    .status(404)
                    .json({ ok: false, message: "DOCTOR NOT FOUND" });
            }
            if (!doctorDb) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        message: "DOCTOR DOES NOT EXIST"
                    });
            }

            let oldPath = `uploads/doctors/${doctorDb.img}`;

            let userTimeStamp;

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                userTimeStamp = { id: userId, date: new Date().getDate(), message: "Modification IMG" };
            } else {
                userTimeStamp = { id: userId, date: new Date().getDate(), message: "Creation IMG" };
            }

            if (doctorDb.users.length = 3) {
                doctorDb.users[0] = doctorDb.users[1];
                doctorDb.users[1] = doctorDb.users[2];
                doctorDb.users[2] = userTimeStamp;
            } else {
                doctorDb.users.push(userTimeStamp);
            }

            doctorDb.img = fileName;

            doctorDb.save((err, doctorUpdated) => {
                if (err) {
                    return res.status(500).json({ ok: false, err });
                }
                return res.json({
                    ok: true,
                    message: "DOCTOR IMG UPDATED",
                    doctorUpdated
                });
            });
        });
    }
}

module.exports = app;