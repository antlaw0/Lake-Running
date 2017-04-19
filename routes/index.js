var express = require('express');
var router = express.Router()

var Lake = require('../models/lake');

/* GET home page. */
router.get('/', function(req, res, next) {
  Lake.find(function(err, lakes){
    if (err) {
      return next(err);
    }

    res.render('index', { lakes: lakes });
  })
});

/* POST to home page - handle form submit */
router.post('/', function(req, res, next){

  // Make a copy of non-blank fields from req.body

  var lakeData = {};

  for (var field in req.body) {
    if (req.body[field]) {      // Empty strings are false
      lakeData[field] = req.body[field];
    }
  }

  // Extract the date, set to Date.now() if not present
  var date = lakeData.dates || Date.now();
  lakeData.datess = [ date ];  // A 1-element array
  delete(lakeData.dates);   // remove dateSeen, don't need

  console.log(lakeData);

  var lake = Lake(lakeData);  //Create new lake  from req.body

  lake.save(function(err, newlake){

    if (err) {

      if (err.name == 'ValidationError') {

        //Loop over error messages and add the message to messages array
        var messages = [];
        for (var err_name in err.errors) {
          messages.push(err.errors[err_name].message);
        }

        req.flash('error', messages);
        return res.redirect('/')
      }

      //For other errors we have not anticipated, send to generic error handler
      return next(err);
    }

    console.log(newlake);
    return res.redirect('/')
  })
});

//delete the lake
router.post('/deleteLake', function(req, res, next){
	Lake.findById(req.body.id, function(err, lake){
	if (!err){	
	console.log("Lake with name "+lake.name+" has been deleted");	
	lake.remove();
	}//end of if no error
	});//end of query database
	
	});//end of call to delete lake


router.post('/addDate', function(req, res, next){

  if (!req.body.dateSeen) {
    req.flash('error', 'Please provide a date for your sighting of ' + req.body.name);
    return res.redirect('/');
  }

  // Find the bird with the given ID, and add this new date to the datesSeen array
  Bird.findById( req.body._id, function(err, bird) {

    if (err) {
      return next(err);
    }

    if (!bird) {
      res.statusCode = 404;
      return next(new Error('Not found, bird with _id ' + req.body._id));
    }

    console.log('date saved = ' + req.body.dateSeen);

    bird.datesSeen.push(req.body.dateSeen);  // Add new date to datesSeen array

    console.log(bird.datesSeen)

    // And sort datesSeen
    bird.datesSeen.sort(function(a, b) {
      if (a.getTime() < b.getTime()) { return 1;  }
      if (a.getTime() > b.getTime()) { return -1; }
      return 0;
    });


    bird.save(function(err){
      if (err) {
        if (err.name == 'ValidationError') {
          //Loop over error messages and add the message to messages array
          var messages = [];
          for (var err_name in err.errors) {
            messages.push(err.errors[err_name].message);
          }
          req.flash('error', messages);
          return res.redirect('/')
        }
        return next(err);   // For all other errors
      }

      return res.redirect('/');  //If saved successfully, redirect to main page
    })
  });
});


module.exports = router;
