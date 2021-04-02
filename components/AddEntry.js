/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {TouchableOpacity, View, Text, Platform, StyleSheet} from 'react-native';
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextButton from './TextButton';
import {submitEntry, removeEntry} from '../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import {addEntry} from '../actions';
import {purple, white} from '../utils/colors';

function SubmitBtn({onPress}) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
      onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
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

  const dispatch = useDispatch();
  const key = timeToString();
  const alreadyLogged = useSelector(
    state => state[key] && typeof state[key][0] === 'undefined',
  );

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
    const entry = [state];

    // Update Redux:
    dispatch(
      addEntry({
        [key]: entry,
      }),
    );

    // setState back to 0:
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

    // Update Redux:
    dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      }),
    );

    // Route to Home

    // Update 'DB':
    removeEntry(key);
  };

  const metaInfo = getMetricMetaInfo();

  if (alreadyLogged) {
    return (
      <View style={styles.center}>
        <Ionicons
          name={
            Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy-outline'
          }
          size={100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton style={{padding: 10}} onPress={reset}>
          Reset
        </TextButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateHeader date={new Date().toLocaleDateString()} />
      {Object.keys(metaInfo).map(key => {
        const {getIcon, type, ...rest} = metaInfo[key];
        const value = state[key];

        return (
          <View key={key} style={styles.row}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    height: 45,
    borderRadius: 7,
    marginLeft: 40,
    marginRight: 40,
  },
  submitBtnText: {
    color: white,
    fontSize: 18,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  },
});
