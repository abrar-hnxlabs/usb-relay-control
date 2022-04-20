import React, { useEffect, useState } from 'react';

import { Text,
  Box,
  Switch,
  CircularProgress,
  IconButton,
  Flex,
 } from "@chakra-ui/react";
import { RepeatClockIcon, TimeIcon, MoonIcon } from "@chakra-ui/icons";

interface RelayControlProps {
    name: string;
    deviceId: number;
    checked: boolean;
    onChange: Function;
    delay: number;
}

export const RelayControl = (props: RelayControlProps) => {
  const { name, deviceId, checked, onChange, delay} = props;
  const [countDown, setCountDown] = useState(0);
  const [decrementer, setDecrementer] = useState(Math.round(100/delay));

  const switchOnClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onChange(deviceId, (checked)? "on": "off", -1);
  }

  const momentaryBtnClick = (e: any) => {
    onChange(deviceId, "on", 500);
  }

  useEffect(() => {
    setDecrementer(100/delay);
  }, [delay]);

  useEffect(() => {
    if(countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown(countDown - decrementer);
      }, 1000);
      return () => clearTimeout(timer);
    }

  }, [countDown]);

  const delayBtnClick = (e: any) => {
    onChange(deviceId, "on", delay * 1000);
    setCountDown(100);
  }

  return (
    <Flex flexDirection="row" flexGrow={4} alignItems="baseline" justifyContent="space-around" borderBottom="1px" borderBottomColor="gray.400" borderStyle="solid">
      <Box w="365px" h="50px">
        <Text fontSize="xl" ml={5} >{name}</Text>
      </Box>
      <Box w="120px">
        <Switch size="lg" onChange={switchOnClick} isChecked={checked} />
      </Box>
      <Box w="100px">
        <IconButton aria-label="momentary" icon={<RepeatClockIcon />} colorScheme="blue" variant="outline" onClick={momentaryBtnClick}/>
      </Box>
      <Box w="100px">
        <IconButton aria-label="momentary" icon={<TimeIcon />} colorScheme="red" variant="outline" onClick={delayBtnClick}/>
      </Box>
      <Box w="100px">
        <CircularProgress color="orange" size="35px" value={countDown} />
      </Box>
    </Flex>
  );
}
