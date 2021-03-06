const debug = require('debug')('angular6-demo-api:server');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// Mongo
const mongoConfig = require('./config/database');

mongoose
  .connect(
    mongoConfig.database,
    { useNewUrlParser: true }
  )
  .then(() => debug('MongoDB Connected'))
  .catch((err) => debug(err));

// Routers
const authRouter = require('./routes/auth');
const logRouter = require('./routes/log');
const sporkRouter = require('./routes/spork');

// Middleware
const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/log', logRouter);
app.use('/api/spork', sporkRouter);

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ msg: 'No such route' });
});

// Error handler
app.use((err, req, res) => {
  debug(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ msg: 'An error occurred' });
});

// Log routes to console
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const path = require('path');
  const routerDumpPath = path.join(__dirname, './docs/routes.txt');
  // eslint-disable-next-line global-require
  require('express-print-routes')(app, routerDumpPath);
}

module.exports = app;
