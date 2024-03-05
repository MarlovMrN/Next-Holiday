import axios from "axios";
import express from "express";
import pkg from "geoip-lite";
import countryData from "./country-data.js";
const { lookup } = pkg;

const app = express();
const port = 3000;

const apiKey = process.env.NEXTHOLIDAY_APIKEY;
const apiURL = "https://calendarific.com/api/v2";
const apiEndpoint = "/holidays";

app.get("/", async (req, res) => {
  const country = getCountryData(req);
  if (!country) {
    res.redirect("/404");
  }
  const holidays = await fetchHolidays(country.acronym);
  if (holidays) {
    res.render("index.ejs", {
      holidays: futureHolidaysOnly(holidays),
    });
  } else {
    res.redirect("/500");
  }
});

app.get("/404", (req, res) => {
  //TO-DO create 404 page
  res.send("Not Found");
});

app.get("/500", (req, res) => {
  //TO-DO create 500 page
  res.send("Something went wrong");
});

async function fetchHolidays(countryAcronym) {
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

function futureHolidaysOnly(holidays) {
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

function getCountryData(request) {
  const countryFromEntry = getCountryEntry(request.query.country);
  const countryFromIP = getCountryAcronymByRequest(request);
  return countryFromEntry || countryFromIP || { acronym: "BR" };
}

function getCountryEntry(countryAcronym) {
  const country = countryData.find((element) => {
    element.acronym === countryAcronym;
  });
  return country;
}

function getCountryAcronymByRequest(req) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const lookupIP = lookup(ip);
  const countryAcronym = lookupIP ? lookupIP.country : "";
  return countryAcronym;
}

app.listen(port, () => {
  console.log("Server Listening on port", port);
});
