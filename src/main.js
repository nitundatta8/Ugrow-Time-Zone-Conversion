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

  /* contributor browser utc tome zone   */
  const contributor_schedule = timezone.split(',,');
  const n_contributor_utc = contributor_schedule[0].split(' ');
  const contributor_utc_ms = getUtcTimeZone(n_contributor_utc);
  console.log(" n_contributor_utc " + contributor_utc_ms);

  const utc_difference = diff_utc_ms(browser_utc_ms, contributor_utc_ms) //21600000
  // const current_browser_utc = parseInt(browser_utc[(browser_utc.length) - 1]);
  // const contributor_utc = parseInt(n_contributor_utc[(n_contributor_utc.length) - 1]);
  // console.log(" time_zone " + contributor_utc);

  // const utc_difference = current_browser_utc - contributor_utc;


  for (let i = 0; i < contributor_schedule.length; i++) {
    if (contributor_schedule[i].trim() !== '') {
      let clock = contributor_schedule[i].split(' ');
      let dayName = clock[0];
      console.log("Day: " + dayName);
      let times = clock[1].split(",");
      const contributer_hour_ms = getContributorTime(times);
      console.log("time: " + times);

      const new_hour = changeTimeZone(contributer_hour_ms, utc_difference);
    }
  }
}

/* get contributor time */
function getContributorTime(times) {
  for (let x = 0; x < times.length; x++) {

    let contributor_hour = times[x].split(':');
    console.log(" contributor_hour   " + contributor_hour);
    for (let i = 0; i < contributor_hour.length; i++) {
      const contributer_hour_ms = parseInt(contributor_hour[0]);
    }



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
  const subcriber_ms = (hour * 3600000) + utc_ms;
  console.log(" subcriber_ms " + subcriber_ms);
  const val = 23 * 3600000;
  if (subcriber_ms > val) {
    const current_subcriber_ms = (subcriber_ms % val);

    const str_subcriber_ms = current_subcriber_ms.toString();
    console.log(" 000   " + str_subcriber_ms + " hour " + (str_subcriber_ms / 3600000));
    return str_subcriber_ms;

  }

}
/* ----------------------------------------------------------------- */

const time_zone = document.getElementById('timezone').value;
const currentSubcsriberTimeZone = convertTimeZone(time_zone);


const element = document.getElementById('output');
element.innerHTML = `<div>
<h5></h5>
<h5></h5>
</div>`;
