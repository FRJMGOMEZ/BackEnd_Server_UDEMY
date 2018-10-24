const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const app = express();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");

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

app.post('/google', async(req, res) => {
    let token = req.body.token;
    let googleUser = await verify(token)
        .catch(err => {
            return res
                .status(500)
                .json({ ok: false, message: "ERRROR VERIFING TOKEN" })
        });
    User.findOne({ email: googleUser.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        if (userDb) {
            if (userDb.google === false) {
                return res.status(405).json({
                    ok: false,
                    message: 'USER IS ALREADY REGISTERED'
                })
            }
            let token = jwt.sign({ userDb }, SEED, {
                expiresIn: 432000
            });
            res.status(200).json({ ok: false, userDb, token });
        } else {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                google: true,
                password: "=)",
                img: googleUser.img,
                users: []
            });
            let date = new Date();
            let stringDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
            let userTimeStamp = { date: stringDate, message: "Signed in By Google" };
            user.users.push(userTimeStamp);
            user.save((err, userSaved) => {
                if (err) {
                    return res.status(500).json({ ok: false, err })
                }
                let token = jwt.sign({ userSaved }, SEED, { expiresIn: 432000 });
                res.status(200).json({
                    ok: false,
                    userSaved,
                    token
                })
            })
        }
    })
})

const client = new OAuth2Client("97587997178-d4m3g8lhl9g3flctnvmpmdonk5tgo9c7.apps.googleusercontent.com");
let verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "97587997178-d4m3g8lhl9g3flctnvmpmdonk5tgo9c7.apps.googleusercontent.com" // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture
    };
}



module.exports = app;