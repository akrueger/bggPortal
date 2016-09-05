var CronJob = require('cron').CronJob;
var Wunderground = require('wundergroundnode');
var fs = require('fs');
var moment = require('moment');

new CronJob('0 * * * *', fetch, null, true, 'America/Chicago');

function fetch() {
  var myKey = '20067852acb8425b';
  var wunderground = new Wunderground(myKey);

  console.log('Beginning fetch...')
  wunderground.conditions().request('78731', function(err, response){
    console.log('Fetch completed.')
    var data = JSON.stringify(response.current_observation)
    var date = moment().format();
    var fileName = 'weather_' + date + '.json'
    fs.writeFile(fileName, data, function(error) {
      if(error) throw error;
      console.log('File written: ' + fileName); 
    })
  })
}