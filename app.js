//Requires
let express = require('express');
let mongoose = require('mongoose');

//Inizalization of variables
let app = express();


//Routes
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Request succesfully done'
    })
})

//Connection with MongoDb
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDb')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("DB PORT: 27017 \x1b[32m%s\x1b[0m", 'RUNNING');
});


//Listening request
app.listen(3000, () => {
    console.log('SERVER PORT: 3000 \x1b[32m%s\x1b[0m', ' RUNNING')
})