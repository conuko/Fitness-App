/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {View} from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';

export default function AddEntry() {
  const [state, setState] = useState({
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  });
  const increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
      const count = state[metric] + step;
      setState({
        ...state,
        [metric]: count > max ? max : count,
       });
  };
 const decrement = (metric) => {
      const count = state[metric] - getMetricMetaInfo(metric).step;
      setState({
        ...state,
        [metric]: count < 0 ? 0 : count,
      });
  };
  const slide = (metric, value) => {
    setState({
      ...state,
      [metric]: value,
    });
  };
  return (
    <View>
    </View>
  );
}
