const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const userStudentRoute = require('./routes/userStudent')
const userTutorRoute = require('./routes/userTutor')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const app = express()

const db = mongoose.connection;
dotenv.config()


mongoose.set('useCreateIndex', true)
mongoose.connect("mongodb://localhost:27017/myapp", { useNewUrlParser: true }).then(() => console.log('DB Connected!'));
db.on('error', (err) => {
    console.log('DB connection error:', err.message);
})
mongoose.Promise = global.Promise;

app.use('/uploads', express.static('uploads'));
app.use(morgan("dev"))
app.use(bodyParser.json())


app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use('/userstudent', userStudentRoute)
app.use('/usertutor', userTutorRoute)

module.exports = app;