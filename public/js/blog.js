
var addBlogSubmit = function() {
  console.log("Woot");
  var body = $('#blogBody').val();
  var title = $('#blogTitle').val();
  console.log("Creating new blog",title,body);
  addBlog(title, body);
  return false;
}
