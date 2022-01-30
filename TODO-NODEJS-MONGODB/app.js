const path = require("path");

const express = require("express");

const db = require("./data/database");
const todos = require("./routes/todos");

const app = express();

//set ejs view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parsing incoming req body
app.use(express.urlencoded({ extended: false }));
//serve static files from public folder
app.use(express.static("public"));

app.use(todos);

//handler default error on server side
app.use((error, req, res, next) => {
  console.log("Server Side ERROR", error);
  res.status(500).render("500");
});

db.connectToDatabase().then(() => {
  app.listen(3000);
});
