const express = require('express')
const router = express.Router()
const passport = require('passport')


// Description : Authenticate with google 
router.get('/google', passport.authenticate('google', {scope : ['profile']}))

// Description : Google Authenticate callback 
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to dashboard route with query parameter
    res.redirect('/dashboard');
  });


// Description : Logout User 
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
      if (error) {return next(error)}
      res.redirect('/')
  })
})



module.exports = router