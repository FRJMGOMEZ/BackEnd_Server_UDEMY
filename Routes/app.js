const express = require('express');
const app = express();


app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Request succesfully done'
    })
})

module.exports = app;