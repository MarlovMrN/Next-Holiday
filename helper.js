import axios from "axios";
import pkg from "geoip-lite";
const { lookup } = pkg;

const apiKey = process.env.NEXTHOLIDAY_APIKEY;
const apiURL = "https://calendarific.com/api/v2";
const apiEndpoint = "/holidays";

export async function fetchHolidays(countryAcronym) {
  const options = {
    params: {
      api_key: apiKey,
      country: countryAcronym,
      year: new Date().getFullYear(),
    },
  };
  try {
    const result = await axios.get(apiURL + apiEndpoint, options);
    return result.data.response.holidays;
  } catch (error) {
    console.log(error);
  }
}

export function futureHolidaysOnly(holidays) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDay() + 1;
  const result = holidays.filter((entry) => {
    if (
      entry.date.datetime.month > currentMonth &&
      entry.primary_type.toLowerCase().includes("holiday")
    ) {
      return true;
    } else if (
      entry.date.datetime.month == currentMonth &&
      entry.date.datetime.day > currentDay &&
      entry.primary_type.toLowerCase().includes("holiday")
    ) {
      return true;
    } else {
      return false;
    }
  });

  return result;
}
