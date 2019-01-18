var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');



// Get the access token
var accessToken;

/* GET /calendar */
router.get('/',
  async function(req, res) {
      if (!req.isAuthenticated()) {
          // Redirect unauthenticated requests to home page
          res.redirect('/')
      } else {

          let params = {
              active: { load: true }
          };
          try {
              accessToken = await tokens.getAccessToken(req);
          } catch (err) {
              req.flash('error_msg', {
                  message: 'Could not get access token. Try signing out and signing in again.',
                  debug: JSON.stringify(err)
              });
          }

          if (accessToken && accessToken.length > 0) {
              try {
                  // Get the events
                  var events = await graph.getEvents(accessToken);
                  params.events = events.value;
              } catch (err) {
                  req.flash('error_msg', {
                      message: 'Could not fetch events',
                      debug: JSON.stringify(err)
                  });
              }
          }

          res.render('load', params);
      }
  }
);

router.post('/load10',
    async function(req, res) {
              try {
                  // Get the events
                  var load10 = await graph.loadFiles(accessToken, 10);
              } catch (err) {
                  console.error(err);
                  req.flash('error_msg', {
                      message: 'Could not fetch events',
                      debug: JSON.stringify(err)
                  });
              }

  }
);


module.exports = router;