var express = require('express'); 
var rtData = express();
var reqHandlers = {};

// rtData.use(express.logger('dev'));
// rtData.use(express.bodyParser());

rtData.all('*', function(req, res, next){
  // exit if it's not a CORS request
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');           // 'http://localhost');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  // NO CACHING WITH DEBUG: res.set('Access-Control-Allow-Max-Age', 3600);
  // return OK for OPTIONS preflight requests
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

// PUT /storeActions: store in the database a user action, like a scroll
rtData.put('/storeActions', express.bodyParser, reqHandlers.storeActions(req, res, next));

reqHandlers.storeActions = function(req, res, next) {
  console.log('where, oh where, is the PUT data?');
  debugger;
  // write the content of req.query in the database
  return res.send(200);
  // next();
};
 
rtData.listen(3000);
console.log('Listening for data on port 3000...');

