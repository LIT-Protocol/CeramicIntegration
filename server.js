import http from "http";
import fs from "fs";
import LitJsSdk from "lit-js-sdk";
import url from "url";
import statik from "node-static";

var file = new statik.Server("./");

http
  .createServer(function(req, res) {
    file.serve(req, res);
  })
  .listen(8080);

// const hostname = "127.0.0.1";
// const port = 8080;

// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);

//   // we only have 1 endpoint, and this is it.
//   if (parsedUrl.pathname === "/verify") {
//     const { jwt } = parsedUrl.query;

//     const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt });

//     // The "verified" variable is a boolean that indicates whether or not the signature verified properly.
//     // Note: YOU MUST CHECK THE PAYLOAD AGAINST THE CONTENT YOU ARE PROTECTING.
//     // This means you need to look at "payload.baseUrl" which should match the hostname of the server, and you must also look at "payload.path" which should match the path being accessed, and you must also look at payload.orgId, payload.role, and payload.extraData which will probably be empty
//     // If these do not match what you're expecting, you should reject the request!!

//     // note: you should check payload.path here, too, but we do not because for this demo we are generating a random path every time.
//     if (
//       payload.baseUrl !== "my-dynamic-content-server.com" ||
//       payload.orgId !== "" ||
//       payload.role !== "" ||
//       payload.extraData !== ""
//     ) {
//       // Reject this request!
//       res.statusCode = 401;
//       res.end();
//       return false;
//     }

//     res.statusCode = 200;
//     res.setHeader("Content-Type", "application/json");
//     res.end(
//       JSON.stringify({
//         verified,
//         header,
//         payload
//       })
//     );
//     return;
//   }

//   // serve static file
//   fs.readFile(
//     "/Users/Elliott/Desktop/src/lit/CeramicIntegration" + "/index.html",
//     function(err, data) {
//       if (err) {
//         res.writeHead(404);
//         res.end(JSON.stringify(err));
//         return;
//       }
//       res.writeHead(200);
//       console.log(res);
//       res.end(data);
//     }
//   );
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
