import _ from 'lodash';
import moment from 'moment';
import Video from 'react-native-video';
import Header from '@Components/Header';
import Counter from '@Components/Counter';
import { setUploads } from '@Actions/Core';
import { RNCamera } from 'react-native-camera';
import Animated from 'react-native-reanimated';
import ProgressBar from '@Components/ProgressBar';
import ActivableButton from '@Components/ActivableButton';
import { connect, useDispatch, useSelector } from 'react-redux';
import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { FlatList, View, Text, Image, Dimensions, SafeAreaView, TouchableOpacity, DeviceEventEmitter } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const MAIN_IMAGE_SIZE = windowWidth - 40;
const MAIN_IMAGE_HEIGHT = windowHeight < 802 ? windowHeight * .4 : MAIN_IMAGE_SIZE;


const NavigationFocus = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const resource = useSelector(({ core }) => _.first(core.resources));

  useEffect(() => {
    if (isFocused) {
      if (!!resource && resource.type !== 'video') {
        dispatch(setUploads([]));
      }
      DeviceEventEmitter.emit('hasFocus', {});
    } else {
      DeviceEventEmitter.emit('lostFocus', {});
    }
  }, [ isFocused ]);

  return null;
}

const mapStateToProps = ({ core }) => ({ ...core });

const mapDispatchToProps = (dispatch) => ({
  setResources: (uploads) => dispatch(setUploads(uploads)),
});

class TakeVideoScreen extends React.Component {
  camera = React.createRef();
  player = React.createRef();

  state = {
    progress: 0,
    pause: true,
    isRecording: false,
    mode: RNCamera.Constants.Type.back,
    flash: RNCamera.Constants.FlashMode.off,
    duration: moment.duration(0, 'seconds'),
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('hasFocus', () => {
      if (
        !!this.player && !!this.player.current &&
        _.first(this.props.resources).type === 'video'
      ) {
        this.setState({ pause: false });
      }
    });

    DeviceEventEmitter.addListener('lostFocus', () => {
      if (!!this.player && !!this.player.current) {
        // this.player.current.seek(0);
        this.setState({ pause: true });
      }
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener('hasFocus');
    DeviceEventEmitter.removeListener('lostFocus');
  }

  get image() {
    return !!this.props.resources.length && _.first(this.props.resources).type === 'video' ?
      _.first(this.props.resources) : null
  }

  toggleMode = () => {
    this.setState({
      mode: this.state.mode === RNCamera.Constants.Type.back ?
        RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
    });
  }

  toogleFlash = () => {
    this.setState({
      flash: this.state.flash === RNCamera.Constants.FlashMode.off ?
        RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off
    });
  }

  tooglePause = (value) => {
    this.setState({ pause: !value });
  }

  onEndVideo = () => {
    this.player.current.seek(0);
  }

  resetImage = () => {
    this.props.setResources([]);
  }

  onLoadVideo = ({ duration }) => {
    this.setState({ duration: moment.duration(duration, 'seconds') });
  }

  onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      this.setState({ isRecording: true });
      this.camera.current.recordAsync({
        maxDuration: 60,
        quality: RNCamera.Constants.VideoQuality['720p']
      }).then(({ uri }) => {
        this.setState({ isRecording: false });
        this.props.setResources([{ data: uri, type: 'video' }]);
      });
    } else if (nativeEvent.state === State.END) {
      this.setState({ isRecording: false }, () => this.camera.current.stopRecording());
    }
  }

  onProgressVideo = ({ currentTime, playableDuration, seekableDuration }) => {
    this.setState({ progress: currentTime / seekableDuration });
  }

  renderSelectedImage = () => {
    return <View style={{ flex: 1 }}>
      <View style={{
        borderRadius: 10,
        overflow: 'hidden',
        width: MAIN_IMAGE_SIZE,
        height: MAIN_IMAGE_HEIGHT,
      }}>
        {
          !!this.image && <Video
            ref={this.player}
            resizeMode="cover"
            onEnd={this.onEndVideo}
            paused={this.state.pause}
            onLoad={this.onLoadVideo}
            source={{ uri: this.image.data }}
            // source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
            onProgress={this.onProgressVideo}
            style={{ width: MAIN_IMAGE_SIZE, height: MAIN_IMAGE_HEIGHT, borderRadius: 10 }}
          />
        }
        {
          !this.image && <RNCamera
            captureAudio
            ref={this.camera}
            type={this.state.mode}
            flashMode={this.state.flash}
            style={{ width: MAIN_IMAGE_SIZE, height: MAIN_IMAGE_HEIGHT, borderRadius: 10 }}
            androidCameraPermissionOptions={{
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
            }}
          />
        }
        {
          !this.image && <>
            <TouchableOpacity activeOpacity={.9} onPress={this.toggleMode} style={{
              left: 10,
              width: 40,
              height: 40,
              bottom: 10,
              borderRadius: 20,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
              <Image source={require('@Assets/images/round.png')} />
            </TouchableOpacity>
            <ActivableButton
              onPress={this.toogleFlash}
              inactiveColors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)']}
              containerStyle={{
                zIndex: 1,
                right: 10,
                width: 40,
                bottom: 10,
                height: 40,
                position: 'absolute',
              }}
              style={{
                right: 0,
                width: 40,
                bottom: 0,
                height: 40,
                borderRadius: 20,
                position: 'absolute',
                alignItems: 'center',
                position: 'absolute',
                justifyContent: 'center',
              }}
            >
              <Image source={require('@Assets/images/flash.png')} />
            </ActivableButton>
          </>
        }
        {
          !!this.image && <>
            <View style={{
              left: 10,
              height: 40,
              bottom: 10,
              borderRadius: 20,
              position: 'absolute',
              alignItems: 'center',
              paddingHorizontal: 10,
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
              <Text style={{
                fontSize: 14,
                color: '#FFF',
                textAlign: 'center',
              }}>
                { moment.utc(this.state.duration.as('milliseconds')).format('mm:ss') }
              </Text>
            </View>
            <ActivableButton
              onPress={this.tooglePause}
              inactiveColors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)']}
              containerStyle={{
                zIndex: 1,
                right: 20,
                width: 40,
                bottom: 10,
                height: 40,
                position: 'absolute',
              }}
              style={{
                right: 0,
                width: 40,
                bottom: 0,
                height: 40,
                borderRadius: 20,
                position: 'absolute',
                alignItems: 'center',
                position: 'absolute',
                justifyContent: 'center',
              }}
            >
              {
                !!this.state.pause ?
                  <Image source={require('@Assets/images/play.png')} /> :
                  <Image source={require('@Assets/images/pause.png')} />
              }
            </ActivableButton>
          </>
        }
      </View>
    </View>
  }

  render() {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <NavigationFocus />
      <Header title="Tomar vídeo" titleStyle={{
        fontSize: 18,
        color: '#000',
        marginRight: 5,
        textAlign: 'center',
        fontFamily: 'Muli-ExtraBold',
      }} />
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        { this.renderSelectedImage() }
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{
            top: 10,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
          }}>
            { !this.image && <Counter isRunning={this.state.isRecording} /> }
            { !!this.image && <ProgressBar progress={this.state.progress} /> }
          </View>
          {
            !this.image && <View>
              <View style={{
                left: 0,
                right: 0,
                zIndex: 1,
                bottom: 100,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',

                shadowRadius: 16,
                shadowOpacity: .4,
                shadowColor: '#8A97AD',
                shadowOffset: { width: 0, height: 5 },
              }}>
                <View style={{
                  elevation: 3,
                  borderRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: '#FFF',
                }}>
                  <Text style={{
                    fontSize: 11,
                    color: '#535E71',
                    fontFamily: 'Muli-Bold',
                  }}>
                    Mantén presionado para grabar
                  </Text>
                </View>
                <View style={{
                  elevation: 3,
                  borderLeftWidth: 10,
                  borderRightWidth: 10,
                  borderStyle: 'solid',
                  borderBottomWidth: 10,
                  borderBottomColor: '#FFF',
                  backgroundColor: 'transparent',
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  transform: [{ rotate: '180deg' }]
                }} />
              </View>
              <LongPressGestureHandler
                activeOpacity={.9}
                minDurationMs={500}
                onHandlerStateChange={this.onHandlerStateChange}
              >
                <Animated.View style={{
                  width: 93,
                  height: 93,
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderRadius: 93 / 2,
                  justifyContent: 'center',
                  backgroundColor: '#CDD4E0'
                }}>
                  <View style={{
                    width: 62,
                    height: 62,
                    borderWidth: 2,
                    borderRadius: 31,
                    borderColor: '#F4F7FD',
                    backgroundColor: '#FFF',
                    elevation: 2,
                    shadowOpacity: .5,
                    shadowRadius: 16,
                    shadowColor: '#8A97AD',
                    shadowOffset: { width: 0, height: 5 },
                  }} />
                </Animated.View>
              </LongPressGestureHandler>
            </View>
          }
          {
            !!this.image && <TouchableOpacity onPress={this.resetImage} activeOpacity={.9} style={{
              borderWidth: 1.5,
              borderRadius: 10,
              alignSelf: 'center',
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderColor: '#F4F7FD',
              backgroundColor: '#FFF',

              elevation: 2,
              shadowOpacity: 1,
              shadowRadius: 16,
              shadowColor: '#F0F6FF',
              shadowOffset: { width: 0, height: 5 },
            }}>
              <Text style={{
                fontSize: 16,
                color: '#8A97AD',
                fontFamily: 'Muli-SemiBold',
              }}>
                Tomar de nuevo
              </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TakeVideoScreen);
