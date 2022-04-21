import React, {useEffect, useState} from 'react';

import { Flex, Box, Heading, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { RelayControl } from "./components/RelayControl";
import { DelaySlider } from './components/SliderControl';
import { IRequest, IDeviceState } from "../../types/WebSocketTypes";

function App() {
  const [deviceList, setDeviceList] = useState<any>({});
  const [delay, setDelay] = useState(30);
  const [nonce, setNonce] = useState<Boolean>(true);
  const [ws, setWs] = useState<WebSocket>(new WebSocket("ws://192.168.1.65:8080/relay"));

  useEffect(() => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        operation: "list"
      }));
    };

    ws.onmessage = (e) => {
      const data: IDeviceState = JSON.parse(e.data);
      if(data instanceof Array ) {
        const temp: any = {};
        data.forEach((e: IDeviceState) => {
          temp[e.id] = e;
        })
        setDeviceList(temp);
      } else {
        deviceList[data.id] = data;
        setDeviceList(deviceList);
      }
      setNonce(!nonce);
    };

    ws.onclose = () => {
      setWs(new WebSocket("ws://192.168.1.65:8080/relay"));
    }
  }, [ws, deviceList, nonce]);

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

  const devices: IDeviceState[] = [];
  for (const dev in deviceList) {
    devices.push(deviceList[dev]);
  }

  return (
    <Flex direction="column" justifyContent="baseline" >
      {(ws.readyState === ws.CONNECTING) && renderAlert()}
      <Box bg="tomato">
        <Heading ml={5} color="white" >Automation Relay State</Heading>
      </Box>
      <Box display="flex" alignSelf="center" w="90%">
        <DelaySlider min={10} max={60} onChange={setDelay} />
      </Box>
      { devices.map( (d: IDeviceState) => <RelayControl
        deviceId={d.id}
        name={d.name}
        key={d.id}
        checked={(d.state === "on"? true: false )}
        onChange={relayOnChange}
        delay={delay}
      />)}
    </Flex>
  );
}

export default App;
