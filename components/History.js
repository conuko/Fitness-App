import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {receiveEntries, addEntry} from '../actions';
import {timeToString, getDailyReminderValue} from '../utils/helpers';
import {fetchCalendarResults} from '../utils/api';
import {Agenda} from 'react-native-calendars';

export default function History() {
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
      });
  });
  const renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View>
      {today ? (
        <Text>{JSON.stringify(today)}</Text>
      ) : (
        <Text>{JSON.stringify(metrics)}</Text>
      )}
    </View>
  );
  const renderEmptyDate = (formattedDate) => {
    return (
      <View>
        <Text>No Data for this day</Text>
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
