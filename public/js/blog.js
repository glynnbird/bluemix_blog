
var addBlogSubmit = function() {
  console.log("Woot");
  var body = $('#blogBody').val();
  var title = $('#blogTitle').val();
  console.log("Creating new blog",title,body);
  
  $.ajax({
    type: "GET",
    url: "/api/add",
    data: { body: body, title: title}
  }).done(function(msg) {
    console.log("!!! "+msg)
  })
  
  return false;
}
