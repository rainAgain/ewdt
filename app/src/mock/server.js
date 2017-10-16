const jsonServer = require('json-server');
const db = require('./data/db.js');
const routes = require('./routes.js');

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter(routes);
const port = 5011;
server.use(middlewares);

server.use((request, res, next) => {
  request.method = "GET";
  next();
});

server.use(rewriter);
server.use(router);

server.listen(port,() => {
  console.log('open mock server at localhost:' + port);
});
