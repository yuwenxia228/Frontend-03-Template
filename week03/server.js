const http = require("http");

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.log(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("body:", body);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(
`<html maaa="a">
    <head>
        <style>
            body div span{color: red}
            body div #span{color: yellow}
            body div img{
                width: 50px;
            }
        </style>
    </head>
    <body>
        <div>
            <span id="span">Hello world!</span>
            <img src="" />
        </div>
    </body>
</html>`)
    });
}).listen(8080);

console.log("server started");