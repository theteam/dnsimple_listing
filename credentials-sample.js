var creds = {};

creds.username = ''; 
creds.password = '';                  

exports.username = creds.username;
exports.password = creds.password;
exports.hash = new Buffer(creds.username + ':' + creds.password).toString('base64');