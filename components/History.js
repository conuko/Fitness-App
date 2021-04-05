import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {receiveEntries, addEntry} from '../actions';
import {timeToString, getDailyReminderValue} from '../utils/helpers';
import {fetchCalendarResults} from '../utils/api';
import {Agenda as UdaciFitnessCalendar} from 'react-native-calendars';
import {white} from '../utils/colors';
import MetricCard from './MetricCard';

export default function History() {
  // const [state, setState] = useState({
  //   entries: [],
  //   ready: false,
  //   selectedDate: new Date().toISOString().slice(0, 10),
  // });
  //const [entries, setEntries] = useState([]);
  const [ready, setReady] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const entries = useSelector(state => state.entries);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then(({entries}) => {
        // if we don't have any entries for today, we display the "getDailyReminderValue" to the UI:
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            }),
          );
        }
      })
      //.then(() => setState(() => ({...state, ready: true})));
      .then(() => setReady(true));
  }, [dispatch]);

  const renderItem = (dateKey, {today, ...metrics}, firstItemInDay) => (
    <View style={styles.item}>
      {today ? (
        <View>
          {/* <DateHeaders date={formattedDate} /> */}
          <Text style={styles.noDataText}>{today}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => console.log('Pressed!')}>
          <MetricCard metrics={metrics} />
        </TouchableOpacity>
      )}
    </View>
  );

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  <TouchableOpacity onPress={() => console.log('Pressed!')} />;

  const renderEmptyDate = () => {
    return (
      <View>
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    );
  };

  if (ready === false) {
    return <AppLoading />;
  }

  return (
    <UdaciFitnessCalendar
      items={entries}
      onDayPress={onDayPress}
      renderItem={(item, firstItemInDay) =>
        renderItem(selectedDate, item, firstItemInDay)
      }
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
