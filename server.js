var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var routes = require('./app/routes/index');
var api = require('./app/routes/api');
var app = express();

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/images");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/api', api);

// Catch 404 & forward to Error Handlers below using the next argument & next(err)
app.use(function(req, res, next) {
    var err = new Error ('Not Found');
    err.status = 404;
    next(err);
});

// Error Handlers
// Development Error Handler: Will print stacktrace
/* If the 'env' application setting (a string representing the environment mode) of app's 
GET request is set equal to 'development' execute the Development Error Handler.  */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        /* Set HTTP status of the response to error object's status property if an error is
        returned by the request; if not set the status to 500. */
        res.status(err.status || 500);
        // Render the error page (error.jade)
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler: No stacktrace leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // Render the error page (error.jade)
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/* Access the PORT property in the object containing the user environment by default OR 
use 8080 as the port if default not available. Store result in 'port' variable. */
var port = process.env.PORT || 8080;
// Listen for connections on the specfied port and run a callback
app.listen(port, function() {
    // Print message describing what port Node.js is listening on
    console.log("Node.js listening on " + port);
});

// Make the instance of the express object available throughout our application
module.exports = app;
