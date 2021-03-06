var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const {
  UserLogin,
  UserProfile,
  CompanyLogin,
  CompanyProfile,
  Job,
  Application
} = require('./routes')



mongoose.connect('mongodb+srv://Diksha:DTU%403aug17@cluster0.qrqf9.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log("ok");
    },
        err => {
            console.log('error: ' + err)
        }
);


//mongoose.connect('mongodb+srv://Diksha:<DTU@3aug17>@cluster0.qrqf9.mongodb.net/<dbname>?retryWrites=true&w=majority');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
app.use(express.static('public'))
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('views'));
app.use(express.static('public'))
app.use('/', UserLogin)
app.use('/user/', UserProfile)
app.use('/company/', CompanyLogin)
app.use('/companyprofile/', CompanyProfile)
app.use('/job/', Job)
app.use('/application/', Application)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});