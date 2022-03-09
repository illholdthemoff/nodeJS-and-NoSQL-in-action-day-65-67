const path = require("path");

const express = require("express");

const blogRoutes = require("./routes/blog");
const db = require("./data/database");

const app = express();

// Activate EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static("public")); // Serve static files (e.g. CSS files)

app.use(blogRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
}); // returns a promise, but we use .then since we are not in an async function, and thus cannot use await. We put app.listen in there so that it only tries to listen for everything once connection to database is established
