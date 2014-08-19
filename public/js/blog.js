
var addBlogSubmit = function() {
  var body = $('#blogBody').val();
  var title = $('#blogTitle').val();
  var post = { body: body, title: title};
  $.ajax({
    type: "GET",
    url: "/api/add",
    data: post
  }).done(function(msg) {
     
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
  var html = '<div class="alert alert-success"><b>'+post.title+'</b> '+post.body+'</div>';
  return html;
}

var socket = null;

$(document).ready(function () { 
  console.log("getting posts");

  socket = io.connect(location.origin);
  socket.on('post', function (data) {
    $('#timeline').prepend(renderPost(data));
  });
  
  getLatestPosts(function(posts) {
    console.log("Got",posts)
    for(var i in posts) {
      var post = posts[i];
       $('#timeline').append(renderPost(post));
    }
  });
  
});