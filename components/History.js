import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {receiveEntries, addEntry} from '../actions';
import {timeToString, getDailyReminderValue} from '../utils/helpers';
import {fetchCalendarResults} from '../utils/api';
import {Agenda} from 'react-native-calendars';
import {white} from '../utils/colors';
import DateHeader from './DateHeader';

export default function History(props) {
  const [state, setState] = useState({
    entries: [],
    ready: false,
  });

  const entries = useSelector(_state => _state.entries);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then(({entries}) => {
        // if we don't have any entries for today, we display the "getDailyReminderValue" to the UI:
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: [getDailyReminderValue()],
            }),
          );
        }
      })
      .then(() => setState(() => ({...state, ready: true})));
  }, []);

  const renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View style={styles.item}>
      {today ? (
        <View>
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}>{today}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => console.log('Pressed!')}>
          <Text>{JSON.stringify(metrics)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyDate = formattedDate => {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    );
  };

  return (
    <Agenda
      items={entries}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
