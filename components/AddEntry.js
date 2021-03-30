import React, {useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {getMetricMetaInfo, timeToString} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextButton from './TextButton';
import {submitEntry, removeEntry} from '../utils/api';

function SubmitBtn({onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Submit</Text>
    </TouchableOpacity>
  );
}

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

  const submit = () => {
    const key = timeToString();
    const entry = state;

    // Update Redux

    setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    });

    // Navigate to home

    // Save to 'DB':
    submitEntry({key, entry});

    // Clear local notification
  };

  const reset = () => {
    const key = timeToString();

    // Update Redux

    // Route to Home

    // Update 'DB':
    removeEntry(key);
  };

  const metaInfo = getMetricMetaInfo();

  if (props.alreadyLogged) {
    return (
      <View>
        <Ionicons name="md-happy-outline" size={100} />
        <Text>You already logged your information for today</Text>
        <TextButton onPress={reset}>Reset</TextButton>
      </View>
    );
  }

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
      <SubmitBtn onPress={submit} />
    </View>
  );
}
