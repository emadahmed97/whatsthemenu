var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose')
const User = mongoose.model('User')

passport.use(User.createStrategy());

passport.use(new FacebookStrategy({
    clientID: '460558084318926',
    clientSecret: '29be10650bb57fa0fbfc5f52d2210c32',
    callbackURL: "http://localhost:7777/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      done(null);
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
