const server = require('./server.js');

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('\n*** Server Running on http://localhost:5000 ***\n');
});