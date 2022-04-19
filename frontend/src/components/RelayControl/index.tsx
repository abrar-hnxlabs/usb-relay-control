import React, { useEffect, useState } from 'react';

import { Text, Box, Switch, Stack, CircularProgress, Divider, IconButton } from "@chakra-ui/react";
import { RepeatClockIcon, TimeIcon } from "@chakra-ui/icons";

interface RelayControlProps {
    name: string;
    deviceId: number;
    checked: boolean;
    onChange: Function;
}

export const RelayControl = (props: RelayControlProps) => {
  const { name, deviceId, checked, onChange} = props;
  const [saving, setSaving] = useState(false);

  const switchOnClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onChange(deviceId, (checked)? "on": "off", -1);
    setSaving(true);
  }

  const momentaryBtnClick = (e: any) => {
    onChange(deviceId, "on", 500);
    setSaving(true);
  }

  const delayBtnClick = (e: any) => {
    onChange(deviceId, "on", 10000);
    setSaving(true);
  }

  useEffect(()=> {
    setSaving(false);
  },[checked]);

  return (
      <Box>
        <Stack isInline align="center" direction="row" >
          <Text fontSize="xl" ml={5} width="40%" >{name}</Text>
          <Switch size="lg" onChange={switchOnClick} isChecked={checked} />
          <IconButton aria-label="momentary" icon={<RepeatClockIcon />} colorScheme="blue" variant="outline" onClick={momentaryBtnClick}/>
          <IconButton aria-label="momentary" icon={<TimeIcon />} colorScheme="red" variant="outline" onClick={delayBtnClick}/>
          {saving && <CircularProgress isIndeterminate  thickness={0.3} color="orange" /> }
        </Stack>
        <Divider />
      </Box>
  );
}
