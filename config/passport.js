const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../model/user');
const mongoConfig = require('../config/database');

// eslint-disable-next-line func-names
module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = mongoConfig.secret;

  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      // eslint-disable-next-line prefer-arrow-callback, func-names
      User.findOne({ id: jwtPayload.id }, function(err, user) {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      });
    })
  );
};
