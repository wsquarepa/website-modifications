const http = require("http");
const fs = require("fs");
const url = require("url");
const reqip = require("request-ip")

const port = 8420

http.createServer((req, res) => {
    let responseCode = 404;
    let content = fs.readFileSync("./404.htm");
    let contenttype = "text/html;charset=utf-8"
    const urlObj = url.parse(req.url, true);
    const ip = reqip.getClientIp(req)

    if (urlObj.pathname == "/") {
        responseCode = 200
        content = fs.readFileSync("./index.html")
    } else if (urlObj.pathname.endsWith(".js")) {
        if (!urlObj.pathname.includes("index")) {
            if (fs.existsSync("." + urlObj.pathname)) {
                contenttype = "text/javascript"
                content = fs.readFileSync("." + urlObj.pathname)
            }
        }
    }

    try {
        content = content.toString()
        responseCode = parseInt(responseCode)
        res.writeHead(responseCode, {
            'content-type': contenttype,
        });
        res.write(content);
        res.end();
    } catch (e) {
        console.error(e)
    }
}).listen(port)