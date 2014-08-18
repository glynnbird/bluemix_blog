var cloudant = require('./cloudant.js');
var moment = require('moment');
var DB_NAME = 'blog';
var blog = cloudant.db.use(DB_NAME);



// check to see if view "id" has contains "content"; if not replace it
var checkView = function (id, content, callback) {
  var rev = null;

  // fetch the view
  blog.get(id, function (err, data) {

    // if there's no existing data
    if (!data) {
      data = {};
      rev = null;
    } else {
      rev = data._rev;
      delete data._rev;
    }

    // if comparison  of stringified versions are different
    if (JSON.stringify(data) !== JSON.stringify(content)) {
      if (rev) {
        content._rev = rev;
      }

      // update the saved version
      blog.insert(content, function (err, data) {
        callback(null, true);
      });
    } else {
      callback(null, false);
    }

  });
};

// create any required views
var createViews = function (callback) {

  var views = [],
	  i = 0,
	  v = {};

  // load the views from file
  views = require("./views.json");

  console.log("Checking views");
  for (i = 0; i < views.length; i++) {
    v = views[i];
    checkView(views[i]._id, views[i], function (err, data) {
    });
  }
  callback();
};

// create the blog DB
cloudant.db.create(DB_NAME,function(err, data) {
  createViews( function(err, data) {
  });
});

var addBlogPost = function(title, body, callback) {
  var now = moment().utc(); 
  var blog_post = {
    title: title,
    body: body,
    datetime: now.format("YYYY-MM-DD HH:mm:ss Z"),
    ts: now.unix()
  };
  blog.insert(blog_post, callback);
};

var docify = function(retval) {
  var docs = [];
  if(typeof retval.rows != undefined && retval.rows.length > 0) {
    for(var i in retval.rows) {
      if(typeof retval.rows[i].doc != "undefined") {
        docs.push(retval.rows[i].doc);
      }
    }
  }
  return docs;
};

var getRecentBlogPosts = function(callback) {
  var params = { descending: true, limit: 10, include_docs: true}
  blog.view("matching", "byts", params, function(err, data) {
      var docs = docify(data);
      callback(err, docs);
  });
}

module.exports = {
  addBlogPost: addBlogPost,
  getRecentBlogPosts: getRecentBlogPosts
}