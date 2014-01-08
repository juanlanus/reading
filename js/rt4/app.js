// rt web server
// A pair of web servers, one serving "pages" and the other handling the data
// sent by the readers, mostly "actions"

/** Module dependencies  */
var MongoClient = require('mongodb').MongoClient;

var serverData = require('./serverData');

// DATABASE CONNECTION *********************************************************
MongoClient.connect('mongodb://localhost:27017/rtdb', function(err, db) {
  // everything runs into this db connection callback
  if(err) {
    // throw err;
    console.log( 'Error attempting to connect to the database' );
    console.log( 'error: ' + err.message );
    if( !! err.lineNumber ) { console.log( 'in line #' + err.lineNumber ); };
    return false;
  };

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
node_modules/**
**/node_modules/**
[._]*.s[a-w][a-z]
[._]s[a-w][a-z]
*.un~
Session.vim
.netrwhist
*~

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
