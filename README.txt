# BlueMix blog

This is a demo application to test out Node.js, Cloudant and BlueMix.

It is a simple blogging application with the data being stored in a Cloudant database. When a blog post is published, it is:

* stored in Clouding
* sent to the MQlight message queue
* each server picks up the item from the message queue and broadcasts it to all connected clients via Websockets

This introduces a delay in publishing, but makes the solution scalable over any number of servers. 

It’s only a demo.

