import React, {useState} from 'react';
import {View} from 'react-native';
import {getMetricMetaInfo} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';

export default function AddEntry() {
  const [state, setState] = useState({
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  });
  const increment = metric => {
    const {max, step} = getMetricMetaInfo(metric);
    const count = state[metric] + step;
    setState({
      ...state,
      [metric]: count > max ? max : count,
    });
  };
  const decrement = metric => {
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

  const metaInfo = getMetricMetaInfo();

  return (
    <View>
      <DateHeader date={new Date().toLocaleDateString()} />
      {Object.keys(metaInfo).map(key => {
        const {getIcon, type, ...rest} = metaInfo[key];
        const value = state[key];

        return (
          <View key={key}>
            {getIcon()}
            {type === 'slider' ? (
              <UdaciSlider
                value={value}
                onChange={value => slide(key, value)}
                {...rest}
              />
            ) : (
              <UdaciSteppers
                value={value}
                onIncrement={() => increment(key)}
                onDecrement={() => decrement(key)}
                {...rest}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
