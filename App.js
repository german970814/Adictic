/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import App from './src/App';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

Feather.loadFont();
Ionicons.loadFont();
FontAwesome.loadFont();

const Appa = () => {
  return (<App />)
}

export default Appa;
