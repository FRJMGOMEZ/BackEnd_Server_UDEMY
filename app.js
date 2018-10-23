//////////////REQUIRES/////////////
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require("body-parser");

const appRoutes = require('../SERVER/Routes/app');
const userRoutes = require('../SERVER/Routes/user');
const loginRoutes = require('../SERVER/Routes/login');
const hospitalRoutes = require('../SERVER/Routes/hospital');
const doctorRoutes = require('../SERVER/Routes/doctor');
const searchRoutes = require("../SERVER/Routes/search");
const uploadRoutes = require('../SERVER/Routes/upload');
const imagesRoutes = require('../SERVER/Routes/images');
/////////////////////////////////////

//Inizalization of variables
const app = express()

////////////MIDDLEWARES//////////////
//Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//DataBase routes
app.use('/', appRoutes)
app.use('/user', userRoutes)
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use("/images", imagesRoutes);


////////////////////////////////////////

//////////////MONGODB////////////////////
//Connection with MongoDb
mongoose.connection.openUri("mongodb://localhost:27017/hospitalDb", {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
        console.log("DB PORT: 27017 \x1b[32m%s\x1b[0m", 'RUNNING')
    })
    /////////////////////////////////////////

//Listening request
app.listen(3000, () => {
    console.log('SERVER PORT: 3000 \x1b[32m%s\x1b[0m', ' RUNNING')
})