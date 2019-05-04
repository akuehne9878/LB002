var mysql = require("promise-mysql");

var EntityModel = {
  connectionPromise: mysql.createConnection({
    host: "db4free.net",
    user: "akuehne9878",
    password: "akuehne9878",
    database: "akuehne9878"
  }),

  createEntity: function(entityName, entityObject) {
    var cols = [];
    var bindParams = [];
    var values = [];

    Object.keys(entityObject).forEach(function(key) {
      cols.push(key);
      bindParams.push("?");
      values.push(entityObject[key]);
    });

    return this.connectionPromise.then(function(conn) {
      var query = "INSERT INTO " + entityName + " (" + cols.join(", ") + ") VALUES (" + bindParams.join(", ") + ")";
      console.log("QUERY:\t" + query);
      console.log("VALUES:\t" + values);
      return conn.query(query, values);
    });
  },

  searchEntity: function(entityName, searchObj) {
    return this.connectionPromise.then(function(conn) {
      var query = "SELECT * FROM " + entityName + " WHERE 1=1";
      var values = [];

      if (searchObj) {
        Object.keys(searchObj).forEach(function(key) {
          query += "\n AND " + key + " = ?";
          values.push(searchObj[key]);
        });
      }

      console.log("QUERY:\t" + query);
      console.log("VALUES:\t" + values);

      return conn.query(query, values);
    });
  },

  deleteEntity: function(entityName, searchObj) {
    return this.connectionPromise.then(function(conn) {
      var query = "DELETE FROM " + entityName + " WHERE 1=1";
      var values = [];

      Object.keys(searchObj).forEach(function(key) {
        query += "\n AND " + key + " = ?";
        values.push(searchObj[key]);
      });
      console.log("QUERY:\t" + query);
      console.log("VALUES:\t" + values);

      return conn.query(query, values);
    });
  },

  updateEntity: function(entityName, searchObj, newEntity) {
    return this.connectionPromise.then(function(conn) {
      var query = "UPDATE " + entityName + " SET ";

      var values = [];
      var temp = [];
      Object.keys(newEntity).forEach(function(key) {
        temp.push(key + " = ?");
        values.push(newEntity[key]);
      });

      query += " " + temp.join(", ");
      query += " WHERE 1=1";

      Object.keys(searchObj).forEach(function(key) {
        query += "\n AND " + key + " = ?";
        values.push(searchObj[key]);
      });

      console.log("QUERY:\t" + query);
      console.log("VALUES:\t" + values);

      return conn.query(query, values);
    });
  }
};

module.exports = EntityModel;
