const express = require("express");

var app = express();

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

var PageModel = require("./PageModel.js");

var UserModel = require("./UserModel.js");

app.get("/page", PageModel.searchPage);
app.get("/page/:id", PageModel.getPage);
app.put("/page/:id", PageModel.updatePage);
app.post("/page/", PageModel.createPage);
app.delete("/page/:id", PageModel.deletePage);

app.post("/page/hierarchy", PageModel.hierarchy);

app.post("/user/login", UserModel.login);

app.get("/", function(req, res) {
  res.send("Server started - listening on port " + port);
});

const port = 8080;
app.listen(port, () => {
  console.log("App listening on port 8080");
});
