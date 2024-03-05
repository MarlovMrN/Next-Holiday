import express from "express";
import { fetchHolidays, futureHolidaysOnly, getCountryData } from "./helper.js";

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log("Server Listening on port", port);
});
