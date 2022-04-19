import React, {useEffect, useState} from 'react';

import { SimpleGrid, Box, Heading, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { RelayControl } from "./components/RelayControl";
import { IListResponse, IRequest, IResponse } from "../../types/WebSocketTypes";

function App() {
  const [deviceList, setDeviceList] = useState<IResponse[]>([]);
  const [ws, setWs] = useState<WebSocket>(new WebSocket("ws://192.168.1.65:8080/relay"));
  
  useEffect(() => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        operation: "list"
      }));
    };

    ws.onmessage = (e) => {
      const data: IListResponse = JSON.parse(e.data);
      if (data.operation === "list" ){
        const d = JSON.parse(e.data);
        setDeviceList(d.data);
      } else if (data.operation === "change"){
        const d = JSON.parse(e.data);
        const newDeviceList = deviceList.map(dev => {
          if(dev.deviceId === d.data[0].deviceId){
            return d.data[0];
          }
          return dev;
        });
        setDeviceList(newDeviceList);
      }
    };

    ws.onclose= () => {
      setWs(new WebSocket("ws://192.168.1.65:8080/relay"));
    }
  }, [ws, deviceList]);

  const relayOnChange = (deviceId: number, value: string, revertDelay: number) => {
    const req: IRequest = {
      deviceId,
      operation: value,
      revertDelay
    }
    ws.send(JSON.stringify(req));
  }

  const renderAlert = () => {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertTitle mr={2}>Connecting!</AlertTitle>
        <AlertDescription>Backend service disconnected.</AlertDescription>
      </Alert>
    )
  }

  return (
    <SimpleGrid columns={1} spacing={3} >
      {(ws.readyState === ws.CONNECTING) && renderAlert()}
      <Box bg="tomato">
        <Heading ml={5} color="white" >Automation Relay State</Heading>
      </Box>
      { deviceList.map( (d: any) => <RelayControl
        deviceId={d.deviceId}
        name={d.deviceName}
        key={d.deviceId}
        checked={(d.state === "on"? true: false )}
        onChange={relayOnChange}
      />)}
    </SimpleGrid>
  );
}

export default App;
