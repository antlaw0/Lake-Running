var moment = require('moment');
var Lake = require('../models/lake');

function dateFormat(date) {
  m = moment.utc(date);
  return m.parseZone().format("dddd, MMMM Do YYYY, h:mm a");
}

function runTimeTable(lake){
	return lake.timesRun;
}

var helpers = {
  dateFormatter : dateFormat,
  runTimeTable : runTimeTable
};

module.exports = helpers;
