import express from "express";
import { fetchHolidays, futureHolidaysOnly } from "./helper.js";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const holidays = await fetchHolidays("BR");
  if (holidays) {
    res.render("index.ejs", {
      holidays: futureHolidaysOnly(holidays),
    });
  } else {
    res.redirect("/500");
  }
});

app.get("/500", (req, res) => {
  //TO-DO create 500 page
  res.send("Something went wrong");
});

app.listen(port, () => {
  console.log("Server Listening on port", port);
});
