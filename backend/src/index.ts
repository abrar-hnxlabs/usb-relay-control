import express from "express";
import bodyParser from "body-parser";
import serve from "express-static";
import proxy from "express-http-proxy";
import http, { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Duplex } from "stream";
import { logger } from "./common/logger";
import { RelayHandler } from  "./handlers/ws/relay";

const app = express();
const port = 8080;
const log = logger();
app.use(bodyParser.json())
if (process.env.NODE_ENV === "production") {
  log.info("Serving static assets.");
  app.use(serve(__dirname + '/public'));
} else {
 app.use("/", proxy("localhost:3000"));
}
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: WebSocket, req:IncomingMessage) => {
  switch(req.url){
    case "/relay":
      RelayHandler(ws, req);
      break;
  }
});

const server = http.createServer(app);
server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer) => {
  wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
    wss.emit('connection', ws, req);
  });
});

server.listen(port);
log.info("App listening at %d", port);
