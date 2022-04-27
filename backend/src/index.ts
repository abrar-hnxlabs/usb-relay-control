import express from "express";
import bodyParser from "body-parser";
import serve from "express-static";
import proxy from "express-http-proxy";
import http, { IncomingMessage } from "http";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { Duplex } from "stream";
import { logger } from "./common/logger";
import { RelayWSHandler } from  "./handlers/ws/relay";
import { DeviceState } from "./common/device";

const app = express();
const port = 8080;
const log = logger();
const deviceStateModel = new DeviceState();
const relayHandler = new RelayWSHandler(deviceStateModel);

app.use(bodyParser.json());

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
      ws.on("message", async (d) => { await relayHandler.HandleMessage(ws, d)});
      break;
  }
});

deviceStateModel.on("change", (device) => {
  for (const ws of wss.clients.values()) {
    if(ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(device));
    }
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
