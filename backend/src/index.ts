import express from "express";
import bodyParser from "body-parser";
import proxy from "express-http-proxy";
import http, { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Duplex } from "stream";

import { RelayHandler } from  "./handlers/ws/relay";

const app = express();
const port = 8080;

app.use(bodyParser.json())
app.use("/", proxy("localhost:3000"));

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
