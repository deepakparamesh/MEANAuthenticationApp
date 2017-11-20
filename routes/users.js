var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

router.post('/register', (req, res, next) => {
  //  res.send('You are about to register!!');
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username : req.body.username,
    password : req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success : false, msg:'failed to register user'});
    }else {
      res.json({success : true, msg:'successfully registered'});
    }
  });
});

router.post('/authenticate',(req, res, next) => {
  const username = req.body.username;
  const password  = req.body.password;

  User.getUserByUserName(username, (err, user) => {
    if(err) throw err;

    if(!user){
        return res.json({success: false, msg:'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) =>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data :user}, config.secret, {
          expiresIn : 604800 //1 week
        });
        res.json({
          success : true,
          token : 'JWT '+token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg:'Wrong Password'});
      }
    });
  });
});

 // passport.authenticate('jwt', {session:false})
// passport.authenticate('jwt', {session:false}) - copied from mean
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) =>{
  res.json({user: req.user});
});

module.exports = router;
