import { RawData, WebSocket } from "ws";
import { IRequest } from "../../../../types/WebSocketTypes";
import { logger } from "../../common/logger";
import { DeviceState } from "../../common/device";
import { Logger } from "winston";

export class RelayWSHandler {
  log: Logger;
  deviceState: DeviceState;

  constructor(deviceState: DeviceState) {
    this.log = logger();
    this.deviceState = deviceState;
  }

  async HandleMessage(ws:WebSocket, data: RawData) {
    const packet: IRequest = JSON.parse(data.toString());
    if(packet.operation === "list") {
      ws.send(JSON.stringify(this.deviceState.toArray()));
    } else {
      await this.deviceState.ChangeState(packet.deviceId, packet.operation, packet.revertDelay);
    }
  }
}
