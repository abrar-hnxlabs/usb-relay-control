import  { execFile } from "child_process";
import { promisify } from "util";
import { normalize, join } from "path";
import { IStatus } from "../../../types/WebSocketTypes";

const promisedExec = promisify(execFile);

export const sendCommand = async (operation: string, relay: number): Promise<IStatus> => {
    const args = [`--${operation.toLowerCase()}`, relay.toString()];
    const binPath = join(__dirname, "..", "..", "bin", "sainsmartrelay")
    try {
      const res = await promisedExec(normalize(binPath), args);
      const result = parseOutput(res.stdout);
      return result
    } catch(e) {
      throw(e);
    }
}

const parseOutput = (text: string): IStatus => {
  const tokens: string[] = text.split("\n");
  const obj: IStatus = {};
  tokens.forEach((t: string) => {
    if(t.length < 1) {
      return;
    }
    const temp: string[] = t.split(":");
    const key = parseInt(temp[0].trim());
    const value = temp[1].trim().toLowerCase();
    obj[key] = value;
  })

  return obj
}