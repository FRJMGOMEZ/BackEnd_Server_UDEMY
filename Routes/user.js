const express = require('express');

const bcrypt = require("bcrypt");

const User = require('../Models/user');

const jwt = require('jsonwebtoken');

const mdAuth = require('../Middlewares/auth');

const app = express();



//Get all users.
app.get('/', (req, res, next) => {
    User.find({}, 'name email img role')
        .exec(
            (err, users) => {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            ok: false,
                            message: "ERROR LOADING USERS",
                            errors: err
                        });
                }
                return res
                    .status(200)
                    .json({
                        ok: true,
                        users
                    });
            })
})

//Create new user

app.post('/', mdAuth.verifyToken, (req, res, next) => {
    let body = req.body;
    if (body.role === 'admin_role' || 'user_role') {
        body.role = body.role.toUpperCase()
    }
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    })
    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "ERROR LOADING USERS",
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            response: userSaved,
            userToken: req.user
        })
    })
})


//Update user

app.put('/:id', (req, res) => {
    let body = req.body;
    let id = req.params.id;
    User.findById(id, (err, userDb) => {
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "ERROR SEARCHING USERS",
                    errors: err
                });
        }
        if (!userDb) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "THERE ARE NO USERS WITH THIS ID",
                });
        }
        if (body.name) { userDb.name = body.name }
        userDb.email = body.email;
        userDb.role = body.role;
        userDb.save((err, userSaved) => {
            userSaved.password = ':)';
            if (err) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        message: "ERROR UPDATING USERS",
                        errors: err
                    });
            }
            res.status(200).json({ ok: true, userSaved });
        })
    })
})


app.delete('/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id, (err, userDeleted) => {
        if (err) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "ERROR DELETING USER",
                    errors: err
                });
        }
        if (!userDeleted) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "THERE ARE NO USERS WITH THIS ID"
                });
        }
        res.status(200).json({ ok: true, userDeleted });
    })
})

module.exports = app;