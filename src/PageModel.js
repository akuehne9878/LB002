var EntityModel = require("./EntityModel.js");

var entityName = "page";

function handleResult(rows, res) {
  console.log(rows);
  res.setHeader("Content-Type", "application/json");
  res.send(rows);
}

var PageModel = {
  searchPage: function(req, res) {
    EntityModel.searchEntity(entityName, req.query).then(function(data) {
      handleResult(data, res);
    });
  },
  getPage: function(req, res) {
    EntityModel.searchEntity(entityName, { pageID: req.params.id }).then(function(data) {
      handleResult(data, res);
    });
  },
  createPage: function(req, res) {
    EntityModel.createEntity(entityName, req.body.object).then(function(data) {
      handleResult(data, res);
    });
  },
  updatePage: function(req, res) {
    EntityModel.updateEntity(entityName, { pageID: req.params.id }, req.body.object).then(function(data) {
      handleResult(data, res);
    });
  },
  deletePage: function(req, res) {
    EntityModel.deleteEntity(entityName, { pageID: req.params.id }).then(function(data) {
      handleResult(data, res);
    });
  },

  hierarchy: function(req, res) {
    return EntityModel.connectionPromise
      .then(function(conn) {
        var query = "";

        query += "with recursive cte (pageID, parentID, title) as ( \n";
        query += "  select     pageID, \n";
        query += "             parentID, \n";
        query += "             title \n";
        query += "  from       page \n";
        query += "  where      parentID = ? \n";
        query += "  union all \n";
        query += "  select     p.pageID, \n";
        query += "             p.parentID, \n";
        query += "             p.title \n";
        query += "  from       page p \n";
        query += "  inner join cte on p.parentID = cte.pageID \n";
        query += ") \n";
        query += "select * from cte \n";

        var values = [];
        var parentID = 0;
        values.push(parentID);

        console.log("QUERY:\t" + query);
        console.log("VALUES:\t" + values);

        return conn.query(query, values);
      })
      .then(function(data) {
        var pageMap = new Map();

        data.forEach(function(item) {
          pageMap.set(item.pageID, item);
        });

        var root = null;

        data.forEach(function(item) {
          var parent = pageMap.get(item.parentID);

          if (parent) {
            if (!parent.nodes) {
              parent.nodes = [];
            }
            parent.nodes.push(item);
          } else {
            root = item;
          }
        });

        handleResult(root, res);
      });
  }
};

module.exports = PageModel;
