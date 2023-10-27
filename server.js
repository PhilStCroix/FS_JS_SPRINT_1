global.DEBUG = true;
const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const { newToken, tokenCount } = require('./token');
const path = require('path');

function serveStaticFile(filePath, contentType, res) {
    const absolutePath = path.join(__dirname, filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.statusCode = 404;
            res.end('File not found');
        } else {
            res.setHeader('Content-type', contentType);
            res.statusCode = 200;
            res.end(data);
        }
    });
}

const server = http.createServer(async (req, res) => {
    let path = './public/';
    switch(req.url) {
        case '/':
            path += "index.html";
            res.statusCode = 200;
            fetchFile(path);
            break;
        case '/new':
            if (req.method === 'POST') {
                collectRequestData(req, result => {
                    var theToken = newToken(result.username);
                    res.write(`
                    <!doctype html>
                    <html>
                    <body>
                        ${result.username} token is ${theToken} <br />
                        <a href="http://localhost:3000">[home]</a>
                    </body>
                    </html>
                `);
                res.end();
                });
            } 
            else {
                path += "newtoken.html";
                res.statusCode = 200;
                fetchFile(path);
            };
            break;
        case '/styles.css':
            // path += "styles.css";
            // res.statusCode=200;
            // fetchFile(path, 'text/css');
            serveStaticFile("public/styles.css", 'text/css', res);
            break;
        case '/count':
            var theCount = await tokenCount();
            res.end(`
                <!doctype html>
                <html>
                <link rel="stylesheet" type="text/css" href="/styles.css">
                <body>
                    Token count is ${theCount} <br />
                    <a href="http://localhost:3000">[home]</a>
                </body>
                </html>
            `);
            break;
        default:
            break;
    };

    function fetchFile(path) {
        fs.readFile(path, function(err, data) {
            if(err) {
                console.log(err);
                res.end();
            } else {
                if(DEBUG) console.log('file was served.');
                res.writeHead(res.statusCode, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }   
        })
    };
});
server.listen(3000);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}
