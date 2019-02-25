let express = require('express')
let expressHttpProxy = require('express-http-proxy');
let proxyPath = "http://172.168.1.138:8082";
let app = express()

// Require API routes
let users = require('./routes/demo')
app.use(users)

let apiProxy = expressHttpProxy(proxyPath, {
    proxyReqOptDecorator: function(req) {
        let path = req.path;
        path = path.replace(/^\/api/, '');
        req.path = path;
        return req;
    }
});

app.use('/', function(req, res) {
    apiProxy(req, res);
});

// Export the server middleware
module.exports = {
    path: '/api',
    handler: app
}
