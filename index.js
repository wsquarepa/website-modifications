const http = require("http");
const fs = require("fs");
const url = require("url");
const reqip = require("request-ip")
const crypto = require('crypto');

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
            if (req.method == "GET") {
                if (fs.existsSync("." + urlObj.pathname)) {
                    if ((req.headers.code && req.headers.code == "informativeDonkey") || (urlObj.query.code && urlObj.query.code == "informativeDonkey")) {
                        responseCode = 200
                        content = fs.readFileSync("." + urlObj.pathname)
                    } else {
                        responseCode = 200
                        const iv = crypto.randomBytes(16).toString('hex').slice(0, 16);
                        let key = crypto.createHash('sha256').update(String("informativeDonkey")).digest('base64').substr(0, 32);
                        const cipher = crypto.createCipheriv("aes-256-ctr", key, iv)

                        content = cipher.update(fs.readFileSync("." + urlObj.pathname), "utf-8", "hex")
                        content += cipher.final("hex")
                        contenttype = "text/hex"
                    }
                }
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