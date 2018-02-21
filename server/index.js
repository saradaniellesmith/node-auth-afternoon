const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require(`${__dirname}/strategy`);
const {clientID, secret} = require(`${__dirname}/../config`);
const request = require('request');
const port = 3000;
const app = express();
app.use( session({
  secret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  (console.log(user))
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/login', passport.authenticate('auth0', {
  successRedirect: '/followers',
  failureRedirect: '/login',
  connection: 'github'
}))

app.get('/followers', ( req, res, next ) => {
  console.log("followers")
  if ( req.user ) {
    const FollowersRequest = {
      url: `https://api.github.com/users/${req.user.nickname}/followers`,
      headers: {
        'User-Agent': clientID
      }
    };

  request(FollowersRequest, ( error, response, body ) => {
      res.status(200).send(body);
    });
  } else {
    res.redirect('/login');
  }
});


app.listen( port, () => { console.log(`Server listening on port ${port}`); } );