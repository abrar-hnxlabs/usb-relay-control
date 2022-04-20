import { IncomingMessage } from "http";
import { WebSocket, RawData } from "ws";
import { IRequest, IResponse, IListResponse } from "../../../../types/WebSocketTypes";
import { logger } from "../../common/logger";

const MAX_ON_TIME = 60000;
const log = logger();
export const RelayHandler = (ws: WebSocket, req: IncomingMessage) => {


  ws.on("message", (data: RawData) => {
    const packet: IRequest = JSON.parse(data.toString());
    let res: IListResponse | null = null;
    switch(packet.operation) {
      case "list":
        res = {
          operation: "list",
          data: listDevices()
        }
        break;
      case "on":
        scheduleTurnOff(ws, packet.deviceId, packet.revertDelay);
      case "off":
        res = {
          operation: "change",
          data: [changeState(packet.deviceId, packet.operation)]
        }
        break;
    }
    log.info("deviceId: %d ,changed to '%s', revertDelay: %d", packet.deviceId, packet.operation, packet.revertDelay);
    send(ws, res, 0);
  });
}

function send(ws:WebSocket, data: any, delay: number = 0) {
  setTimeout(()=> {
    ws.send(JSON.stringify(data));
  }, delay);
}

function listDevices(): IResponse[] {
  return [1,2,3,4,5,6,7,8].map((e: number) => {
    const x: IResponse = {
      deviceId: e,
      state: Math.random() > 0.5? "on": "off",
      deviceName: getName(e),
    }
    return x;
  });
}

function getName(deviceId: number):string {
  type NameTypes = {
    [key: string]: string
  }
  const Names: NameTypes = {
    1: "Backyard",
    2: "Frontyard",
    3: "Frontyard Bushes"
  }
  return (Names[deviceId])? Names[deviceId]: "Relay " + deviceId;
}

function changeState(deviceId: number, state: string): IResponse {
  const r: IResponse = {
    deviceId,
    state,
    deviceName: getName(deviceId)
  }
  return r;
}

function scheduleTurnOff(ws:WebSocket, deviceId: number, revertDelay: number) {
  let delay = MAX_ON_TIME;

  if(revertDelay < MAX_ON_TIME) {
    delay = revertDelay;
  }

  if(revertDelay === -1) {
    return;
  }

  setTimeout(() => {
    const data: IListResponse = {
      operation: "change",
      data:[changeState(deviceId, "off")]
    }
    log.info("deviceId: %d, reverted.", deviceId);
    send(ws, data, 0);
  }, delay);
}


