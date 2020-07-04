import moment from 'moment';
import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';

const Counter = ({ isRunning }) => {
  const [ minutes, setMinutes ] = useState(0);
  const [ seconds, setSeconds ] = useState(0);

  useEffect(() => {
    if (isRunning) {
      setTimeout(() => {
        if (seconds + 1 === 60) {
          setSeconds(0);
          setMinutes(minutes + 1);
        } else {
          setSeconds(seconds + 1);
        }
      }, 1000);
    }
  }, [ isRunning, seconds ]);

  return <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <View style={{ backgroundColor: '#F86672', marginHorizontal: 5, width: 8, height: 8, borderRadius: 4 }} />
    <Text style={{
      fontSize: 12,
      fontFamily: 'Muli-Bold',
    }}>
      { `${moment(minutes, 'm').format('mm')}:${moment(seconds, 's').format('ss')}` }
    </Text>
  </View>;
}

export default Counter;
