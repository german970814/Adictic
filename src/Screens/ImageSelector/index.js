import _, { after } from 'lodash';
import ImageCarousel from './Carousel';
import { setUploads } from '@Actions/Core';
import React, { useState, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ActivableButton from '@Components/ActivableButton';
import Header, { HEADER_HEIGHT } from '@Components/Header';
import { useFocusEffect } from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, View, Text, Image, Dimensions, SafeAreaView, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const MAIN_IMAGE_SIZE = windowWidth - 40;
const AVAILABLE_IMAGE_SIZE = ((windowWidth - 40) / 4) - 3;
const MAIN_IMAGE_HEIGHT = windowHeight < 802 ? windowHeight * .4 : MAIN_IMAGE_SIZE;
const IMAGE_GALLERY_CONTAINER_SIZE = windowHeight - HEADER_HEIGHT - MAIN_IMAGE_SIZE;


const NavigationFocus = () => {
  const dispatch = useDispatch();
  const resource = useSelector(({ core }) => _.first(core.resources));

  useFocusEffect(
    useCallback(() => {
      !!resource && resource.type === 'video' && dispatch(setUploads([]))
    }, [])
  );

  return null;
}

const ImageSelector = ({ images, onPaginate, onSelected=_.noop, multipleMode=false }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const selected = useSelector(({ core }) => core.resources);
  // const [ selected, setSelected ] = useState([]);

  const onPressImage = useCallback((image) => {
    if (
      !multipleMode &&
      (!!selected.length && selected[0].data !== image.node.image.uri || !selected.length)
    ) {
      dispatch(setUploads([{ data: image.node.image.uri, type: 'image' }]));
    } else if (!!multipleMode) {
      const index = _.findIndex(selected, ({ data }) => data === image.node.image.uri);

      if (index !== -1) {
        const copy = [ ...selected ];
        copy.splice(index, 1);
        dispatch(setUploads(copy));
      } else {
        dispatch(setUploads([ ...selected, { data: image.node.image.uri, type: 'image' }]));
      }
    }
  }, [ selected, multipleMode ]);

  return <FlatList
    data={images}
    numColumns={4}
    onEndReached={onPaginate}
    onEndReachedThreshold={.8}
    keyExtractor={(item, index) => `item__${index}`}
    columnWrapperStyle={{ marginTop: 3, paddingHorizontal: 20 }}
    style={{ height: IMAGE_GALLERY_CONTAINER_SIZE - insets.top }}
    // data={[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ]}
    renderItem={({ item, index }) => {
      const isSelected = _.findIndex(selected, ({ data }) => data === item.node.image.uri);

      return <TouchableOpacity activeOpacity={.9} onPress={onPressImage.bind(null, item)} style={{
        elevation: 2,
        borderRadius: 6,
        shadowRadius: 8,
        shadowOpacity: 0.77,
        shadowColor: '#D6E0F2',
        backgroundColor: '#FFF',
        marginLeft: index % 4 === 0 ? 0 : 3,
        shadowOffset: { width: 0, height: 5 },
      }}>
        <Image
          // source={{ uri: `https://randomuser.me/api/portraits/women/${index + 1}.jpg` }}
          source={{ uri: item.node.image.uri }}
          style={{
            borderRadius: 6,
            borderColor: '#FEA0A8',
            width: AVAILABLE_IMAGE_SIZE,
            height: AVAILABLE_IMAGE_SIZE,
            borderWidth: (isSelected !== -1 && !multipleMode) ? 2 : 0,
          }}
        />
        {
          !!multipleMode && <LinearGradient
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            colors={isSelected !== -1 ? ['#FEA0A8', '#FF7783'] : ['rgba(255, 255, 255, .33)', 'rgba(255, 255, 255, .33)']}
            style={{
              top: 8,
              right: 5,
              width: 20,
              height: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#FFF',
              alignItems: 'center',
              position: 'absolute',
              justifyContent: 'center',
            }}
          >
            {
              isSelected !== -1 && <Text style={{
                fontSize: 12,
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Muli-Bold',
              }}>
                { isSelected + 1 }
              </Text>
            }
          </LinearGradient>
        }
      </TouchableOpacity>
    }}
  />
}

class ImageSelectorScreen extends React.Component {
  state = {
    after: '',
    images: [],
    resizeMode: 'cover',
    multipleMode: false,
  }

  componentDidMount() {
    this.getFirstImages();
  }

  getFirstImages = () => {
    this.requestPhotosPermission()
      .then((granted) => {
        granted && this.getImages()
          .then((response) => {
            if (!!response.edges.length) {
              this.props.setResources([{ data: response.edges[0].node.image.uri, type: 'image' }]);
            }
          });
      })
  }

  requestPhotosPermission = async () => {
    if (Platform.OS === 'ios') {
      return Promise.resolve(true);
    }

    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  }

  _getPaginationOptions = () => {
    const options = {
      first: 100,
      assetType: 'Photos',
      after: this.state.after,
    }

    return _.reduce(_.keys(options), (acc, curr) => {
      if (!!options[curr]) {
        acc[curr] = options[curr];
      }
      return acc;
    }, {});
  }

  getImages = () => {
    if (this.state.after === false) {
      return Promise.resolve(null);
    }
  
    return CameraRoll.getPhotos(this._getPaginationOptions()).then((response) => {
      this.setState({
        images: [ ...this.state.images, ...response.edges ],
        after: response.page_info.has_next_page === false ? false : response.page_info.end_cursor,
      });
      return response;
    });
  }

  setMultipleMode = (multipleMode) => {
    this.setState({ multipleMode });

    if (!multipleMode && !!this.props.resources.length) {
      this.props.setResources([ _.last(this.props.resources) ]);
    }
  }

  onChangeImageResizeMode = () => {
    this.setState({ resizeMode: this.state.resizeMode === 'cover' ? 'contain' : 'cover' });
  }

  renderSelectedImage = () => {
    return <View style={{
      width: windowWidth,
      // height: windowWidth - 35,
      height: MAIN_IMAGE_HEIGHT,
    }}>
      {/* <Image
        source={{ uri: 'https://randomuser.me/api/portraits/women/16.jpg' }}
        style={{ width: windowWidth - 40, height: windowWidth - 40, borderRadius: 10 }} /> */}
      <ImageCarousel
        height={MAIN_IMAGE_HEIGHT}
        resizeMode={this.state.resizeMode} />
      <TouchableOpacity activeOpacity={.9} onPress={this.onChangeImageResizeMode} style={{
        left: 30,
        width: 40,
        height: 40,
        bottom: 10,
        borderRadius: 20,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}>
        <Image source={require('@Assets/images/expand.png')} />
      </TouchableOpacity>
      <ActivableButton
        onPress={this.setMultipleMode}
        inactiveColors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)']}
        containerStyle={{
          right: 30,
          bottom: 10,
          position: 'absolute',
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={require('@Assets/images/layer.png')} />
      </ActivableButton>
    </View>
  }

  renderAvailableImages = () => {
    return <View style={{ }}>
      <ImageSelector
        images={this.state.images}
        onPaginate={this.getImages}
        multipleMode={this.state.multipleMode} />
    </View>
  }

  render() {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <NavigationFocus />
      <Header
        title="Recientes"
        titleIcon={<FontAwesome style={{ fontSize: 21, color: '#CDD4E0' }} name="angle-down" />}
        titleStyle={{
          fontSize: 16,
          marginRight: 5,
          color: '#8A97AD',
          textAlign: 'center',
          fontFamily: 'Muli-Bold',
        }} />
      { this.renderSelectedImage() }
      { this.renderAvailableImages() }
    </SafeAreaView>
  }
}

const mapStateToProps = ({ core }) => ({ ...core });

const mapDispatchToProps = (dispatch) => ({
  setResources: (uploads) => dispatch(setUploads(uploads)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelectorScreen);
