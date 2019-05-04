var EntityModel = require("./EntityModel.js");

var entityName = "user";

function handleResult(rows, res) {
  console.log(rows);
  res.setHeader("Content-Type", "application/json");
  res.send(rows);
}

var UserModel = {
  searchUser: function(req, res) {
    EntityModel.searchEntity(entityName, req.body.object).then(function(data) {
      handleResult(data, res);
    });
  },
  getUser: function(req, res) {
    EntityModel.searchEntity(entityName, { pageID: req.params.id }).then(function(data) {
      handleResult(data, res);
    });
  },
  createUser: function(req, res) {
    EntityModel.createEntity(entityName, req.body.object).then(function(data) {
      handleResult(data, res);
    });
  },
  updateUser: function(req, res) {
    EntityModel.updateEntity(entityName, { pageID: req.params.id }, req.body.object).then(function(data) {
      handleResult(data, res);
    });
  },
  deleteUser: function(req, res) {
    EntityModel.deleteEntity(entityName, { pageID: req.params.id }).then(function(data) {
      handleResult(data, res);
    });
  },

  login: function(req, res) {
    return EntityModel.connectionPromise
      .then(function(conn) {
        console.log(req.body);
        var userID = req.body.user.user;
        var password = req.body.user.password;

        var query = "Select userID from user where userID = ? and pw = ?";

        var values = [];
        values.push(userID);
        values.push(password);

        console.log("QUERY:\t" + query);
        console.log("VALUES:\t" + values);

        return conn.query(query, values);
      })
      .then(function(data) {
        handleResult(data, res);
      });
  }
};

module.exports = UserModel;
