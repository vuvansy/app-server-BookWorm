var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

require('dotenv').config()

//mongoose
const mongoose = require("mongoose");

// Connect to DB
mongoose.connect(process.env.MONGO_URL)
  .then(() =>
    console.log(">>>>>>>>>> MongoDB Connected successfully ✅ !")
  )
  .catch((err) => console.log(">>>>>>>>> DB Error: ❌", err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var fileRouter = require('./routes/file');
var booksRouter = require('./routes/books');
var genresRouter = require('./routes/genre');
var authorRouter = require('./routes/author');
var couponRouter = require('./routes/coupon');
var bannerRouter = require('./routes/banner');
var orderRouter = require('./routes/order');
var orderDetailRouter = require('./routes/order-detail');
var reviewRouter = require('./routes/review');
var bookLikeRouter = require('./routes/book-like');
var deliveryRouter = require('./routes/delivery');
var paymentRouter = require('./routes/payment');
var statsRouter = require('./routes/stats');
var postRouter = require('./routes/post');
var vnpayRouter = require('./routes/vnpay');

var app = express();

// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions = { origin: true };
//   callback(null, corsOptions);
// };


app.use(cors({
  origin: true,
  credentials: true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', "DELETE"]
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors(corsOptionsDelegate));

//Khai báo route
app.use('/', indexRouter);
app.use('/api/v1', usersRouter);
app.use('/api/v1/file', fileRouter);
app.use('/api/v1', booksRouter);
app.use('/api/v1', genresRouter);
app.use('/api/v1', authorRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1', couponRouter);
app.use('/api/v1', bannerRouter);
app.use('/api/v1', deliveryRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', orderDetailRouter);
app.use('/api/v1', reviewRouter);
app.use('/api/v1', bookLikeRouter);
app.use('/api/v1', statsRouter);
app.use('/api/v1', postRouter);
app.use('/vnpay', vnpayRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
