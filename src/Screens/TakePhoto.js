import _ from 'lodash';
import Header from '@Components/Header';
import { setUploads } from '@Actions/Core';
import { RNCamera } from 'react-native-camera';
import { connect, useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ActivableButton from '@Components/ActivableButton';
import { FlatList, View, Text, Image, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const MAIN_IMAGE_SIZE = windowWidth - 40;
const MAIN_IMAGE_HEIGHT = windowHeight < 802 ? windowHeight * .4 : MAIN_IMAGE_SIZE;

const NavigationFocus = () => {
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(setUploads([]))
    }, [])
  );

  return null;
}

const mapStateToProps = ({ core }) => ({ ...core });

const mapDispatchToProps = (dispatch) => ({
  setResources: (uploads) => dispatch(setUploads(uploads)),
});

class TakePhotoScreen extends React.Component {
  camera = React.createRef();
  state = {
    mode: RNCamera.Constants.Type.back,
    flash: RNCamera.Constants.FlashMode.off,
  }

  get image() {
    return !!this.props.resources.length ?
      this.props.resources[0] : null
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

  takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    const data = await this.camera.current.takePictureAsync(options);
    this.props.setResources([{ data: data.uri, type: 'image' }]);
  }

  resetImage = () => {
    this.props.setResources([]);
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
          !!this.image && <Image
            source={{ uri: this.image.data }}
            style={{ width: MAIN_IMAGE_SIZE, height: MAIN_IMAGE_HEIGHT, borderRadius: 10 }}
          />
        }
        {
          !this.image && <RNCamera
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
              bottom: 10,
              height: 40,
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
      </View>
    </View>
  }

  render() {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <NavigationFocus />
      <Header title="Tomar foto" titleStyle={{
        fontSize: 18,
        color: '#000',
        marginRight: 5,
        textAlign: 'center',
        fontFamily: 'Muli-ExtraBold',
      }} />
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        { this.renderSelectedImage() }
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {
            !this.image && <TouchableOpacity activeOpacity={.9} onPress={this.takePicture} style={{
              width: 93,
              height: 93,
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
            </TouchableOpacity>
          }
          {
            !!this.image && <TouchableOpacity activeOpacity={.9} onPress={this.resetImage} style={{
              borderWidth: 1.5,
              borderRadius: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(TakePhotoScreen);
