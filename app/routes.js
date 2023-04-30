module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('clickerQuest').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            clickerQuest: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/clickerQuest', (req, res) => {
      db.collection('clickerQuest').save({name: req.body.name, hero: req.body.hero, exp: 50, HP: 100, thumbDown:0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/clickerQuest', (req, res) => {
      let identity = req.user.local.email
      let profileCheck = req.body.name
   if(identity === profileCheck && Math.random() > .5 && req.body.HP > 0){
      db.collection('clickerQuest')
      .findOneAndUpdate({name: req.body.name, hero: req.body.hero, exp: req.body.exp, HP: req.body.HP}, {
        $set: {
          exp:req.body.exp + Math.floor(Math.random() * (500 - 200 + 1)) + 200,
          HP: req.body.HP - 30
        }
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })}
      else if(identity === profileCheck && Math.random() < .5 && req.body.HP > 0){
        db.collection('clickerQuest')
        .findOneAndUpdate({name: req.body.name, hero: req.body.hero, exp: req.body.exp, HP: req.body.HP}, {
          $set: {
            exp:req.body.exp + Math.floor(Math.random()*50) + 50,
            HP: req.body.HP - 10
          }
        }, {
          sort: {_id: -1},
          upsert: false
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })}else if(identity === profileCheck && req.body.HP <= 0){
          db.collection('clickerQuest')
          .findOneAndUpdate({name: req.body.name, hero: req.body.hero, exp: req.body.exp, HP: req.body.HP}, {
            $set: {
              exp:req.body.exp = 0,
              HP: req.body.HP = 0
            }
          }, {
            sort: {_id: -1},
            upsert: false
          }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
          })
        }

    })
    app.put('/clickerQuest/HP', (req, res) => {
      db.collection('clickerQuest')
      .findOneAndUpdate({name: req.body.name, hero: req.body.hero}, {
        $set: {
          HP :req.body.HP = 100,
        }
        
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    

    app.delete('/clickerQuest', (req, res) => {
      let identity = req.user.local.email
      let profileCheck = req.body.name
   if(identity === profileCheck){
      db.collection('clickerQuest').findOneAndDelete({name: req.body.name, hero: req.body.hero}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })}
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash clickerQuest
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash clickerQuest
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
