// passport-facebook.js
const GoogleStrategy  = require('passport-google-oauth20').Strategy;
const config = require('../Config/configAPI.js');
const db = require("../models");
const User = db.User;
module.exports = function(passport) {
    passport.use(new GoogleStrategy({
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.callback_urlgg,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo' // Add this line to fetch user profile data
    }, function(accessToken, refreshToken, profile, done) {
      User.findOne({ where: { socialID: profile.id } }).then((user) => {
        if (user) {
          // User already exists, update their information in the database
          user.update({
            HoVaTen: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            avtUrl: profile.photos?.[0]?.value,
            DiaChi:'chưa cập nhật',
            ngaySinh : 'chưa cập nhật'
          }).then(() => done(null, user))
          .catch((err) => {
            console.error('Error updating user:', err);
            return done(err);
          });
        } else {
          // User doesn't exist, create a new user and save their information to the database
          const { id, displayName, emails, photos } = profile;
          const email = emails?.[0]?.value || '';
          const photoUrl = photos?.[0]?.value;
          const address = profile._json?.address || '';
          User.create({
            socialID: id,
            email,
            Matkhau: "do_not_save_password_when_login_with_google",
            HoVaTen : displayName,
            avtUrl : photoUrl,
            DiaChi:'chưa cập nhật',
            ngaySinh : 'chưa cập nhật',

          }).then((newUser) => {
            return done(null, newUser);
          }).catch((err) => {
            console.error('Error creating user:', err);
            return done(err);
          });
        }
      }).catch((err) => {
        console.error('Error finding user:', err);
        return done(err);
      });
    }));
  };
