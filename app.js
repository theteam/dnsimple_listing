/**
 * Module dependencies.
 */

require.paths.unshift('.')

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
app.get('/',
function(req, res) {
    
    https.get({
        host: 'dnsimple.com',
        path: '/domains/?format=json',
        headers: {'Authorization': 'Basic ' + auth.hash}
    }, 
    function(r) {
        r.on('data', function(d) {            
            var domains = JSON.parse(d.toString());
            res.render('index', {
                title: 'domains',
                domains: domains
            });
        });
    }).on('error',
    function(e) {
        console.error(e);
    });
});


app.get('/domain/:d',
function(req, res) {
    
    https.get({
        host: 'dnsimple.com',
        path: '/domains/'+ req.params.d  +'/records/?format=json',
        headers: {'Authorization': 'Basic ' + auth.hash}
    }, 
    function(r) {
        r.on('data', function(d) {            
            var records = JSON.parse(d.toString());
            
            console.log("DOMAIN:", records);
            
            res.render('domain', {
                title: req.params.d,
                records: records
            });
        });
    }).on('error',
    function(e) {
        console.error(e);
    });
});





// Only listen on $ node app.js
if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}
