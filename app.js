const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// Mongo
const mongoConfig = require('./config/database');
mongoose.connect(mongoConfig.database, { useNewUrlParser: true });

// Routers
const authRouter = require('./routes/auth');

// Middleware
const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ 'msg': 'An error occurred'})
});

// Log routes to console
if (process.env.NODE_ENV === 'development') {
  const path = require('path');
  const routerDumpPath = path.join(__dirname, './docs/routes.txt');
  require('express-print-routes')(app, routerDumpPath);
}

module.exports = app;
