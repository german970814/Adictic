import _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';


const ActivableButton = ({ children, containerStyle, style, onPress=_.noop, ...props }) => {
  const [ active, setActive ] = useState(false);

  const onPressHandler = useCallback(() => {
    onPress(!active)
    setActive(!active);
  }, [ active ]);

  return <TouchableOpacity style={containerStyle} onPress={onPressHandler} activeOpacity={.9}>
    <LinearGradient
      { ...props }
      style={style}
      end={{ x: 1, y: 0 }}
      start={{ x: 0, y: 0 }}
      colors={active ? props.activeColors || ['#FEA0A8', '#FF7783'] : props.inactiveColors || ['rgba(255, 255, 255, .33)', 'rgba(255, 255, 255, .33)']}
    >
      { children }
    </LinearGradient>
  </TouchableOpacity>
}

export default ActivableButton;
