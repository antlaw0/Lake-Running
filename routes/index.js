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
  var date = lakeData.dateRun || Date.now();
  var time = lakeData.timeRun;
  
  lakeData.timesRun = [ time;  // A 1-element array
  
  lakeData.datesRun = [ date ];  // A 1-element array
  delete(lakeData.dateRun);   // remove dateRun , don't need

  console.log(lakeData);

  var lake = Lake(lakeData);  //Create new Lake from req.body

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
	
	});//end of call to delete bird


router.post('/addDateRun', function(req, res, next){

  if (!req.body.dateRun) {
    req.flash('error', 'Please provide a date for your run of ' + req.body.name);
    return res.redirect('/');
  }

  // Find the lake  with the given ID, and add this new date to the datesRun array
  Lake.findById( req.body._id, function(err, lake) {

    if (err) {
      return next(err);
    }

    if (!lake) {
      res.statusCode = 404;
      return next(new Error('Not found, lake with _id ' + req.body._id));
    }

    console.log('run saved = ' + req.body.dateRun);

    lake.datesRun.push(req.body.dateRun);  // Add new date to datesRun array

    console.log(lake.datesRun)

    // And sort datesRun
    lake.datesRun.sort(function(a, b) {
      if (a.getTime() < b.getTime()) { return 1;  }
      if (a.getTime() > b.getTime()) { return -1; }
      return 0;
    });


    lake.save(function(err){
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
