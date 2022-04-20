import React, { useState } from 'react';

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Text,
  Stack,
  VStack,
} from '@chakra-ui/react'

interface IDelaySliderProps {
  onChange: Function;
  min: number;
  max: number;
}

export const DelaySlider = (props: IDelaySliderProps) => {
  const { min, max, onChange} = props;
  const [curVal, setCurVal] = useState(30);

  const selfOnChange = (val: number) => {
    setCurVal(val);
    onChange(val);
  }
  return (
    <VStack>
      <Slider aria-label='slider-ex-1' defaultValue={30} min={min} max={max} step={10} onChangeEnd={selfOnChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize="25px" />

      </Slider>
      <Text>Auto Turn Off: {curVal} s</Text>
    </VStack>
  );
};
