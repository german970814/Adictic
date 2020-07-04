import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

export default class ProgressBar extends Component {
  
  UNSAFE_componentWillMount() {
    this.animation = new Animated.Value(this.props.progress);
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.progress !== this.props.progress) {
      Animated.timing(this.animation, {
        useNativeDriver: false,
        toValue: this.props.progress,
        duration: this.props.duration,
      }).start();
    }
  }
  
  render() {
    const { row, height } = this.props;
    
    const widthInterpolated = this.animation.interpolate({
      inputRange: [ 0, 1 ],
      extrapolate: 'clamp',
      outputRange: ['0%', '100%'],
    })
    
    return (
      <View style={[{ flexDirection: 'row', height: 5, borderRadius: 10 }, row ? { flex: 1 } : undefined ]}>
        <View style={{ flex: 1 }} >
          <View 
            style={[ StyleSheet.absoluteFill, { backgroundColor: '#F4F7FD', borderRadius: 5 } ]}
          />
          <Animated.View 
            style={{
              top: 0,
              left: 0,
              bottom: 0,
              borderRadius: 5,
              position: 'absolute',
              width: widthInterpolated,
              backgroundColor: '#FEA0A8',
            }}
          />
        </View>
      </View>
    );
  };
};

ProgressBar.defaultProps = {
  duration: 100,
}
