export interface IRequest {
  operation: string;
  deviceId: number;
  revertDelay: number;
}

export interface IResponse {
  deviceId: number;
  state: string;
  deviceName: string;
  delay: number;
  remaining: number;
}

export interface IListResponse {
operation: string;
data: IResponse[];
}

export interface IDeviceState {
  id: number;
  state: string;
  turnoffDelay: number;
  name: string;
}

export interface IStatus {
  [key: number]: string
}