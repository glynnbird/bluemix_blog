
var addBlogSubmit = function() {
  var body = $('#blogBody').val();
  var title = $('#blogTitle').val();
  var post = { body: body, title: title};
  $.ajax({
    type: "GET",
    url: "/api/add",
    data: post
  }).done(function(msg) {
    $('#timeline').prepend(renderPost(msg));
  })
  
  return false;
}

var getLatestPosts = function(callback) {
  
  $.ajax({
    type: "GET",
    url: "/api/recent"
  }).done(function(msg) {
     callback(msg);
  });
}

var renderPost = function(post) {
  var t = moment.unix(post.ts);
  var html = '<div id="' + post._id + '" class="alert alert-success"><b>'+post.title+'</b> '+post.body+'<br><span class="label label-default">'+t.format("YYYY-MM-DD HH:mm:ss")+'</span></div>';
  return html;
}

var socket = null;

$(document).ready(function () { 

  socket = io.connect(location.origin);
  socket.on('post', function (data) {
    // if the post doesn't already exist,
    if($('#'+data._id).length==0) {
      $('#timeline').prepend(renderPost(data));
    }

  });
  
  getLatestPosts(function(posts) {
    for(var i in posts) {
      var post = posts[i];
       $('#timeline').append(renderPost(post));
    }
  });
  
});