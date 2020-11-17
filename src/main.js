
import moment from 'moment-timezone';
import './style.css';

const schedules = document.getElementById('timezone').value;
console.log(' schedules ' + schedules);
const currentSubcsriberTimeZone = convertSchedule(schedules);
let element = document.getElementById('schedule');
let scheduleUI = '';

currentSubcsriberTimeZone.forEach(function (value, key) {
  value = value.replaceAll(",", "<br>")
  scheduleUI += `<div class="float-child">
                  <h5>${key}:</h5>${value}
                </div>`
});
element.innerHTML = scheduleUI;


function convertSchedule(schedules) {
  const dayMapping = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
    'sunday': 7
  };

  const contributor_schedule = schedules.split(',,');

  let dayName = '';
  let dayINeed = 0;
  let browser_time_zone = '';
  let map = new Map();

  //contributor utc time zone.Exp: UTC - 4
  const utc = contributor_schedule[0];
  const new_utc = utc.substring(3, utc.length).replaceAll(" ", "");
  const currentUtc = (new_utc.length !== 3) ? new_utc[0] + "0" + new_utc[1] : new_utc;

  //contributor day and times.Exp: monday 18:00:00 pm
  for (let i = 1; i < contributor_schedule.length; i++) {

    if (contributor_schedule[i].trim() !== '') {
      let days_times = contributor_schedule[i].split(' ');
      dayName = days_times[0];   // Exp: monday
      console.log('dayName  ' + dayName)
      dayINeed = dayMapping[dayName];   //Exp: 1 for monday

      const dateOfDay = getDateOfDay(dayINeed); // Exp: 2020-11-16
      console.log("  date Of day   " + dateOfDay);
      const times = days_times[1].split(',');  // Exp:  01:00:00
      console.log('clock:' + times);

      for (let i = 0; i < times.length; i++) {
        browser_time_zone = convertToBroserTime(dateOfDay, times[i], currentUtc); //Exp: 2020-11-15T23:00:00-10:00
        console.log('browser_timezone ' + browser_time_zone);
        let browser_day_name = moment(browser_time_zone).format('dddd'); // Exp:Monday
        console.log(' browser day ' + browser_day_name);
        let browser_day_time = moment(browser_time_zone).format('h:mma z');
        console.log(' browser_day_time ' + browser_day_time);

        if (map.has(browser_day_name)) {
          console.log("map " + map.get(browser_day_name))
          map.set(browser_day_name, map.get(browser_day_name) + "," + browser_day_time);
        } else {
          map.set(browser_day_name, browser_day_time);
        }

      }
    }
  }
  console.log(map)
  return map;
}

/* convert contributor time to Browser time. Exp: 2020-11-15T23:00:00-10:00 */

function convertToBroserTime(dateOfday, clock, currentUtc) {
  let map = new Map();

  const channelTime = moment(dateOfday + "T" + clock + currentUtc + ":00", "YYYY-MM-DDThh:mm:ssZ");
  // const channelTime = moment(dateOfday + "T12:10:00+6:00", "YYYY-MM-DDThh:mm:ssZ");
  console.log("timezone::::::: " + moment.tz.guess());
  const browserTimeZone = moment.tz.guess();
  const browser_time_zone = channelTime.tz(browserTimeZone).format();
  console.log("date formatted: " + channelTime.tz(browserTimeZone).format('MM-DD-YYYYThh:mm:ssZ'));
  return browser_time_zone;
}

/*   contributer date of the day */
function getDateOfDay(dayINeed) {

  const today = moment().isoWeekday();
  let dateOfDay = '';

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    dateOfDay = moment().isoWeekday(dayINeed).format("YYYY-MM-DD");
    console.log("date:: " + moment().isoWeekday(dayINeed).format("YYYY-MM-DD"));
  } else {
    // otherwise, give me *next week's* instance of that same day
    dateOfDay = moment().add(1, 'weeks').isoWeekday(dayINeed).format("YYYY-MM-DD")
    console.log("date:: " + moment().add(1, 'weeks').isoWeekday(dayINeed).format("YYYY-MM-DD"));
  }
  return dateOfDay;
}

