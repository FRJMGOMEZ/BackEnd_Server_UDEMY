const express = require('express');

const bcrypt = require("bcrypt");

const User = require('../Models/user');

const verifyToken = require('../Middlewares/auth').verifyToken;

const verifyAdmin = require('../Middlewares/admin').verifyAdmin;

const app = express();



//Get all users.
app.get('/', (req, res, next) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || null;

    User.find({}, 'name email img role')
        .skip(from)
        .limit(limit)
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

                User.count({}, (err, conteo) => {

                    return res
                        .status(200)
                        .json({
                            ok: true,
                            users,
                            total: conteo
                        });
                })
            })
})

//Create new user

app.post('/', [verifyToken, verifyAdmin], (req, res, next) => {

    let userId = req.user._id;

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
        users: [],
    })

    let date = new Date();
    let stringDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

    let userTimeStamp = { id: userId, date: stringDate, message: "Creation" };

    user.users.push(userTimeStamp);

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "ERROR SAVING USER",
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

app.put('/:id', [verifyToken, verifyAdmin], (req, res) => {

    let userId = req.user._id;
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
        if (body.email) { userDb.email = body.email }
        if (body.role) { userDb.role = body.role }

        let date = new Date()
        let stringDate = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

        let userTimeStamp = { id: userId, date: stringDate, message: "Modification" };

        if ((userDb.users.length = 3)) {
            userDb.users[0] = userDb.users[1];
            userDb.users[1] = userDb.users[2];
            userDb.users[2] = userTimeStamp;
        } else {
            userDb.users.push(userTimeStamp)
        }

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


app.delete('/:id', [verifyToken, verifyAdmin], (req, res) => {
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