export interface IRequest {
  operation: string;
  deviceId: number;
  revertDelay: number;
}

export interface IResponse {
  deviceId: number;
  state: string;
  deviceName: string;
}

export interface IListResponse {
operation: string;
data: IResponse[];
}
