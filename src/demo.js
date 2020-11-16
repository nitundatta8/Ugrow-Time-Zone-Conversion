import moment from 'moment-timezone';

function getTimeZone(timezone) {
  const timezoneObj = {
    'UTC - 5': "America/New_York",
    'UTC - 6': "America/Chicago",
    'UTC - 8': "America/Los_Angeles",
    'UTC - 7': "America/Denver",
    'UTC - 9': "America/Atka",
    'UTC - 10': "Pacific/Honolulu"
  }
  for (const [key, value] of Object.entries(timezoneObj)) {
    if (value === timezone) {
      return key;
    }
  }
}

function convertTimeZone(timezone) {
  /*  browser utc tome zone */
  const browserTimeZone = moment.tz.guess();

  const browser_utc = getTimeZone(browserTimeZone).split(" ");
  const browser_utc_ms = getUtcTimeZone(browser_utc); // -10:30 num   -34200000ms
  console.log(" browser_utc_ms " + browser_utc_ms + " hour:: " + browser_utc_ms / 3600000);

  /* contributor browser utc tome zone   */
  const contributor_schedule = timezone.split(',,');
  const n_contributor_utc = contributor_schedule[0].split(' ');
  const contributor_utc_ms = getUtcTimeZone(n_contributor_utc);
  console.log(" n_contributor_utc " + contributor_utc_ms + " contributor hour :: " + contributor_utc_ms / 3600000);

  const utc_difference = diff_utc_ms(browser_utc_ms, contributor_utc_ms) //21600000
  console.log(" utc_difference " + utc_difference + " utc_difference hour :: " + utc_difference / 3600000);



  for (let i = 0; i < contributor_schedule.length; i++) {
    if (contributor_schedule[i].trim() !== '') {
      let clock = contributor_schedule[i].split(' ');
      let dayName = clock[0];
      console.log("Day: " + dayName);
      let times = clock[1].split(",");
      const contributer_hour_ms = getContributorTime(times);
      console.log("time: " + times);

      const new_hour = changeTimeZone(contributer_hour_ms, utc_difference);
      console.log("new_hour: " + new_hour + " new----hour " + new_hour / 3600000);
    }
  }
}

/* get contributor time */
function getContributorTime(times) {
  for (let x = 0; x < times.length; x++) {

    let c_hour = times[x].split(':');

    let hour_in_ms = 0;
    let minute_in_ms = 0;
    let total_time = 0;
    for (let i = 0; i < c_hour.length; i++) {
      if (i == 0) {
        hour_in_ms = parseInt(c_hour[0]) * 3600000;
      }
      if (i == 1) {
        minute_in_ms = parseInt(c_hour[1]) * 60000;
      }

      //const contributer_hour_ms = parseInt(contributor_hour[0]);
    }
    total_time = hour_in_ms + minute_in_ms;
    //console.log(" -------- total_time ----------" + total_time);
    return total_time;
  }
}


/*  diff_utc_ms */
function diff_utc_ms(con_num, sub_num) {
  let flag = false;
  let utc_diff = 0;
  if (con_num > sub_num) {
    flag = true;
  }
  if (flag) {
    utc_diff = con_num - sub_num;
  } else {
    utc_diff = sub_num - con_num;
  }
  console.log(" utc_diff " + utc_diff);
  return utc_diff;
}

/*-------------get utc time in milisecond ------------------------ */
function getUtcTimeZone(browser_utc_str) {
  let browser_str = '';
  for (let i = 1; i < browser_utc_str.length; i++) {
    console.log(" local: " + browser_utc_str[i]);
    browser_str += browser_utc_str[i];
  }
  let browser_utc = browser_str.split(':');

  let new_browser_utc_hm = 0;
  let new_browser_utc_mm = 0;
  for (let x = 0; x < browser_utc.length; x++) {
    if (x == 0) {
      new_browser_utc_hm = parseInt(browser_utc[0]) * 3600000;
    }
    if (x == 1) {
      new_browser_utc_mm = parseInt(browser_utc[1]) * 60000;
    }
  }
  const browser_utc_time = new_browser_utc_hm + new_browser_utc_mm;
  console.log(" local timezone: " + browser_utc + " ---  " + browser_utc_time);
  return browser_utc_time;
}
/*-------------------------------------- */
/*----   change hour -----*/
function changeTimeZone(hour, utc_ms) {

  const subcriber_ms = hour + utc_ms;
  console.log(" subcriber_ms   " + subcriber_ms + " subcriber_hour  " + subcriber_ms / 3600000);
  const val = 23 * 3600000;
  if (subcriber_ms > val) {
    const current_subcriber_ms = (subcriber_ms % val);

    const str_subcriber_ms = current_subcriber_ms.toString();
    console.log(" str_subcriber_ms   " + str_subcriber_ms);
    return str_subcriber_ms;

  }

}
/* ----------------------------------------------------------------- */

const time_zone = document.getElementById('timezone').value;
const currentSubcsriberTimeZone = convertTimeZone(time_zone);

//const currentSubcsriberTimeZone = convert_zone(time_zone);

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

  for (let i = 0; i < contributor_schedule.length; i++) {

    if (contributor_schedule[i].trim() !== '') {
      let clock = contributor_schedule[i].split(' ');
      if (clock[0].trim() !== 'UTC') {
        dayName = clock[0];
        console.log("Day: " + dayName);
        dayINeed = dayMapping[dayName];
        console.log("weekday:" + dayMapping[dayName]);
        const week_day = getDateOfDay(dayINeed);
        console.log("  week_day   " + week_day);
      }
    }
  }
  // const contributor_day = dayMapping[dayName];
  // console.log("weekday:" + dayMapping[dayName]);
  const browser_zone = moment.tz.guess();
  console.log("timezone::::::: " + moment.tz.guess());
  // const dayINeed = 4; // for Thursday
  const today = moment().isoWeekday();

  // if we haven't yet passed the day of the week that I need:
  // if (today <= dayINeed) {
  //   // then just give me this week's instance of that day
  //   console.log("date:: " + moment().isoWeekday(dayINeed).format("MM/DD/YYYY"));
  // } else {
  //   // otherwise, give me *next week's* instance of that same day
  //   console.log("date:: " + moment().add(1, 'weeks').isoWeekday(dayINeed).format("MM/DD/YYYY"));
  // }


  const channelTime = moment("2020-11-16T06:13:00+06:00", "YYYY-MM-DDThh:mm:ssZ");
  const browserTimeZone = moment.tz.guess();
  console.log("date formatted: " + channelTime.tz(browserTimeZone).format());
}

function getDateOfDay(dayINeed) {
  console.log("  dayINeed  " + dayINeed);
  const today = moment().isoWeekday();
  let dateOfDay = '';
  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    dateOfDay = moment().isoWeekday(dayINeed).format("MM/DD/YYYY");
    console.log("date:: " + moment().isoWeekday(dayINeed).format("MM/DD/YYYY"));
  } else {
    // otherwise, give me *next week's* instance of that same day
    dateOfDay = moment().add(1, 'weeks').isoWeekday(dayINeed).format("MM/DD/YYYY")
    console.log("date:: " + moment().add(1, 'weeks').isoWeekday(dayINeed).format("MM/DD/YYYY"));
  }
  return dateOfDay;
}

dateOfDay(time_zone);
