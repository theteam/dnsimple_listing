/**
 * Module dependencies.
 */

require.paths.unshift('.');

var express = require('express');
var https = require('https');
var url = require('url');
var auth = require('credentials');

var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development',
function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production',
function() {
    app.use(express.errorHandler());
});


// Routes

// Root - list domains.
app.get('/',
function(req, res) {
    app.getData('/domains/?format=json', function(d){
        res.render('index', {
            title: 'domains',
            domains: d
        });
    });
});


// domain details.
app.get('/domain/:d',
function(req, res) {
    app.getData('/domains/'+ req.params.d  +'/records/?format=json', function(d){
        res.render('domain', {
            title: req.params.d,
            records: d
        });
    });
});


// Go and make an authenticated request for data from DNSimple
app.getData = function(path, callback) {  
    https.get({
        host: 'dnsimple.com',
        path: path,
        headers: {'Authorization': 'Basic ' + auth.hash}
    }, 
    function(r) {
        r.on('data', function(d) {            
            var data = JSON.parse(d.toString());            
            callback(data);
        });
    }).on('error',
    function(e) {
        console.error(e);
    });  
};


// all entries for a given IP address
app.get('/ip/:ip',
function(req, res) {
    
});





// Only listen on $ node app.js
if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}
