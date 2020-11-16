import moment from 'moment-timezone';

const time_zone = document.getElementById('timezone').value;
const currentSubcsriberTimeZone = dateOfDay(time_zone);



const element = document.getElementById('output');
element.innerHTML = `<div>
<h5></h5>
<h5></h5>
</div>`;



function dateOfDay(timezone) {
  const dayMapping = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6,
    'sunday': 7
  };

  const contributor_schedule = timezone.split(',,');
  console.log("   contributor_schedule   " + contributor_schedule);
  let dayName = '';
  let dayINeed = 0;
  let browser_time = '';
  for (let i = 0; i < contributor_schedule.length; i++) {

    if (contributor_schedule[i].trim() !== '') {
      let clock = contributor_schedule[i].split(' ');
      if (clock[0].trim() !== 'UTC') {
        dayName = clock[0];
        console.log("Day: " + dayName);
        dayINeed = dayMapping[dayName];
        console.log("weekday:" + dayMapping[dayName]);
        const dateOfday = getDateOfDay(dayINeed);
        console.log("  date Of day   " + dateOfday);
        browser_time = getBroserTimeZone(dateOfday);
      }
    }
  }

}

/* browser */

function getBroserTimeZone(dateOfday) {

  const channelTime = moment(dateOfday + "T06:13:00+06:00", "YYYY-MM-DDThh:mm:ssZ");
  console.log("timezone::::::: " + moment.tz.guess());
  const browserTimeZone = moment.tz.guess();
  const browser_time_zone = channelTime.tz(browserTimeZone).format();
  console.log("date formatted: " + channelTime.tz(browserTimeZone).format('MM-DD-YYYYThh:mm:ssZ'));
  let momenntObj = moment(browser_time_zone).format('dddd');
  console.log(' browser day ' + momenntObj);
  // var month = check.format('M');
  // var day = check.format('D');
  // var year = check.format('YYYY');
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

