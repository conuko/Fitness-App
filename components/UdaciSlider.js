import React from 'react';
import {View, Text} from 'react-native';
import Slider from '@react-native-community/slider';

export default function UdaciSlider({max, unit, step, value, onChange}) {
  return (
    <View>
      <Slider 
        styp={step}
        value={value}
        maximumValue={max}
        onValueChange={onChange}
      />
      <View>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>
  );
}
