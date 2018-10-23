const express = require('express');
const fs = require("fs");
const path = require('path');
const app = express();

const User = require("../Models/user");
const Hospital = require("../Models/hospital");
const Doctor = require("../Models/doctor");


app.get('/:type/:fileName', (req, res, next) => {

    let type = req.params.type;
    let fileName = req.params.fileName;

    if (fs.existsSync(pathImage)) {
        let pathImage = path.resolve(__dirname, `../uploads/${type}/${fileName}`);
        res.sendFile(pathImage)
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/NoPhoto.jpg');
        res.sendFile(pathNoImage)
    }
})

module.exports = app;