const express = require("express");

const app = express();

const Hospital = require('../Models/hospital');
const Doctor = require('../Models/doctor');
const User = require('../Models/user');



app.get('/collection/:collection/:search', (req, res) => {

    let search = req.params.search;
    let collection = req.params.collection;

    let promise;

    let regEx = new RegExp(search, "i");


    switch (collection) {

        case 'users':
            promise = searchUsers(search, regEx);
            break;
        case 'hospitals':
            promise = searchHospital(search, regEx);
            break;
        case 'doctors':
            promise = searchDoctors(search, regEx);
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'THERE ARE NOT SUCH COLLECTION'
            })
    }

    promise.then(
        data => {

            if (data === undefined) {
                return res.json(404).json({
                    ok: false,
                    message: `NO ${collection} HAS BEEN FOUND`
                })
            }
            return res.status(200).json({
                ok: true,
                [collection]: data
            })
        })
})



app.get('/all/:search', (req, res, next) => {

    let search = req.params.search;

    let regEx = new RegExp(search, 'i');

    Promise.all([
            searchHospital(search, regEx),
            searchDoctors(search, regEx),
            searchUsers(search, regEx)
        ])
        .then(responses => {

            return res.status(200).json({
                ok: true,
                hospitals: responses[0],
                doctors: responses[1],
                users: responses[2]
            });
        })
})

function searchHospital(search, regEx) {

    return new Promise((resolve, reject) => {

        Hospital
            .find({ name: regEx })
            .populate('user', 'name')
            .exec(
                (err, hospitalsDb) => {
                    if (err) { reject('ERROR LOADING HOSPITALS') } else {
                        resolve(hospitalsDb)
                    }
                })
    })
}

function searchDoctors(search, regEx) {
    return new Promise((resolve, reject) => {
        Doctor
            .find({ name: regEx })
            .populate('user', 'name')
            .populate('hospital', 'name')
            .exec((err, doctorsDb) => {
                if (err) {
                    reject("ERROR LOADING DOCTORS");
                } else {
                    resolve(doctorsDb);
                }
            });
    });
}

function searchUsers(search, regEx) {
    return new Promise((resolve, reject) => {
        User
            .find({}, 'name email role img')
            .or([{ name: regEx }, { email: regEx }])
            .exec((err, users) => {

                if (err) {
                    reject('ERROR LOADING USERS')
                } else { resolve(users) }
            })
    });
}


module.exports = app;