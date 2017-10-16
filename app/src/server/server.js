var express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const port = 5012;//express端口默认5012
var api = require('./api');
var app = express();

//解决跨域，发布时修改Access-Control-Allow-Origin为服务器所在ip或域名
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//接口请求路由
app.use('/',api);

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('api listening at http://%s:%s', host, port);
});
