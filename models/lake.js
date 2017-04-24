var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


/* Represents a lake */
var lakeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
  description: String,
  timesRun: {type: Number },
  datesRun: [ { type: Date, default: Date.now, validate: {
    validator : function(date) {
    //return false if date is in the future
      return (date.getTime() < Date.now()) ; //time is less than now, in past
    }, message: '{VALUE} is not a valid run date. Date must be in the past'
	}} ]
})      // end of mongoose.Schema declaration

var Lake = mongoose.model('Lake', lakeSchema);
lakeSchema.plugin(uniqueValidator);



module.exports = Lake;
