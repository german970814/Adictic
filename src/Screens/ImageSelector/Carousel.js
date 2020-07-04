import _ from 'lodash';
import { useSelector } from 'react-redux';
import Carousel from '@Components/Carousel';
import { Image, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');


const ImageCarousel = ({ resizeMode, height, onPageChange=_.noop }) => {
  const carousel = useRef(null);
  const [ lastImage, setLastImage ] = useState({});
  const resources = useSelector(({ core }) => core.resources);

  useEffect(() => {
    if (!!resources.length) {
      setLastImage(resources[0]);
      if (!!carousel && !!carousel.current) {
        carousel.current.scrollToEnd();
      }
    }
  }, [ resources ]);

  return <Carousel
    sneak={10}
    showPaginator
    ref={carousel}
    swipeThreshold={.15}
    onPageChange={onPageChange}
    pageWidth={windowWidth - 40}
    containerStyle={{
      height: height,
      paddingVertical: 0,
      alignItems: 'center',
      // height: windowWidth - 40,
      justifyContent: 'center',
    }}
  >
    {
      _.map(!!resources.length ? resources : [ lastImage ], ({ data, type }, index) => (
        <Image
          source={{ uri: data }}
          resizeMode={resizeMode}
          key={`image__${type}_${index}`}
          // style={{ width: '100%', height: windowWidth - 40, borderRadius: 10 }} />
          style={{ width: '100%', height: height, borderRadius: 10 }} />
      ))
    }
  </Carousel>
}

export default ImageCarousel;
