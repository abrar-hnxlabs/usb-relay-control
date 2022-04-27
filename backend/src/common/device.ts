import { IDeviceState, IStatus  } from "../../../types/WebSocketTypes";
import EventEmitter from "events";
import { Logger } from "winston";
import { logger } from "./logger";
import { sendCommand } from "./relay_command";

export class DeviceState extends EventEmitter {
  deviceStatesMap: Map<number, IDeviceState>;
  log: Logger;

  constructor() {
    super();
    this.log = logger();
    this.deviceStatesMap = new Map<number, IDeviceState>();
    [1,2,3,4,5,6,7,8].forEach(async (e: number) => {
      await this.ChangeState(e, "off", -1);
    });

  }

  public toArray() {
    const devArray = [];
    for(const dev of this.deviceStatesMap.values()) {
      devArray.push(dev);
    }
    return devArray;
  }

  updateState(statuses: IStatus) {
    for(let idString in statuses) {
      const id = parseInt(idString);
      const v: IDeviceState = this.GetDeviceState(id);
      v.state = statuses[idString];
      this.deviceStatesMap.set(id, v);
    }
  }

  GetDeviceState(id: number): IDeviceState {
    let v: IDeviceState | undefined = this.deviceStatesMap.get(id);
    if(!v) {
      v = {
        id,
        state: "unknown",
        turnoffDelay: -1,
        name: this.getName(id)
      }
    }
    return v;
  }

  async ChangeState(id: number, state: string, turnoffDelay: number): Promise<void> {
    try {
      const res = await sendCommand(state, id);
      this.updateState(res);
      this.log.info(res);
    } catch (e) {
      this.log.error(e);
      return 
    }
    const v: IDeviceState = this.GetDeviceState(id);
    v.turnoffDelay = turnoffDelay;
    this.deviceStatesMap.set(id, v);
    if(turnoffDelay > 0 ){
      this.autoTurnOff(id, turnoffDelay);
    }
    this.emit("change", v);
    this.log.info("deviceId: %d ,changed to '%s', revertDelay: %d", v.id, v.state, v.turnoffDelay);
  }

  autoTurnOff(id: number, delay: number): void {
    setTimeout(() => {
      this.ChangeState(id, "off", -1);
    }, delay);
  }

  getName(deviceId: number):string {
    type NameTypes = {
      [key: string]: string
    }
    const Names: NameTypes = {
      1: "Backyard",
      2: "Frontyard",
      3: "Entryway"
    }
    return (Names[deviceId])? Names[deviceId]: "Relay " + deviceId;
  }

}
