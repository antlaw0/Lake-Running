var moment = require('moment');

function dateFormat(date) {
  m = moment.utc(date);
  return m.parseZone().format("dddd, MMMM Do YYYY, h:mm a");
}

function runTimeTable(times, dates) {

  var out = "<table>"
  var out = out + "<tr><th>Time Taken</th><th>Date</th></tr>"

  // Loop over arguments, build one row of table for each time - date pair
  for (var x = 0 ; x < times.length; x++) {
      out = out + "<tr><td>" + times[x] + "</td><td>" + dateFormat(dates[x]) + "</td></tr>"
  }

  out = out + "</table>";
  return out;

}


var helpers = {
  dateFormatter : dateFormat,
  runTimeTable: runTimeTable
};

module.exports = helpers;
