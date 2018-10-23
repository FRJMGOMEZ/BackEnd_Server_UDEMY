const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const app = express();
const jwt = require('jsonwebtoken');

const SEED = require('../config/config');

app.post('/', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'ERROR IN SEARCHING USERS'
            })
        }

        if (!userDb) {

            return res.status(400).json({
                ok: false,
                message: 'THERE ARE NO USERS WITH THIS -EMAIL'
            })
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "THERE ARE NO USERS WITH THIS -PASSWORD"
                });
        }

        userDb.password = ':)';

        let token = jwt.sign({ userDb }, SEED, { expiresIn: 432000 });

        res.status(200).json({
            ok: true,
            userDb,
            id: userDb.id,
            token
        })
    })
})



module.exports = app;