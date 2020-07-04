import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  I18nManager,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';


const { width } = Dimensions.get("window");

let Style = StyleSheet.create({
  container: {
    flex: 1,
    // alignSelf: "stretch",
    justifyContent: "center",
  },
  page: {
    flex: 1
  }
});

export default class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gap: undefined,
      currentPage: props.currentPage,
    };

    this._scrollTimeout = null;

    this._resetScrollPosition = this._resetScrollPosition.bind(this);
    this._handleScrollEnd = this._handleScrollEnd.bind(this);
  }

  UNSAFE_componentWillMount() {
    this._calculateGap(this.props);
  }

  componentDidMount() {
    this._resetScrollPosition(false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      currentPage: nextProps.currentPage
    });
    this._calculateGap(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentPage !== this.props.currentPage) {
      this._resetScrollPosition();
      this._onPageChange(this.props.currentPage);
    } else if (prevState.currentPage !== this.state.currentPage) {
      this._resetScrollPosition();
      this._onPageChange(this.state.currentPage);
    }
  }

  componentWillUnmount() {
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }
  }

  scrollToEnd = () => {
    this.scrollView.scrollToEnd({ animated: true, duration: 500 });
  }

  _getPageOffset() {
    const { gap } = this.state;
    const { pageWidth } = this.props;

    return pageWidth + gap;
  }

  _getPageScrollX(pageIndex) {
    return pageIndex * this._getPageOffset();
  }

  _getPagesCount() {
    return React.Children.count(this.props.children);
  }

  _resetScrollPosition(animated=true) {
    // in android, you can't scroll directly in componentDidMount
    // (http://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working)
    // however this doesn't work in android for some reason:
    // InteractionManager.runAfterInteractions(() => {
    //     this.scrollView.scrollTo({ y: 0, x: pagePosition}, true);
    //     console.log('scrollView.scrollTo x:', pagePosition);
    // });
    // So I was left with an arbitrary timeout.
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }
    this._scrollTimeout = setTimeout(() => {
      this.scrollView.scrollTo({
        y: 0,
        animated,
        x: this._getPageScrollX(this.state.currentPage),
      });
      this._scrollTimeout = null;
    }, this.props.transitionDelay);
  }

  _calculateGap(props) {
    const { sneak, pageWidth } = props;
    if (pageWidth > width) {
      throw new Error("invalid pageWidth");
    }
    /*
      ------------
    |            |
    |-   ----   -|
    | | |    | | |
    | | |    | | |
    | | |    | | |
    |-   ----   -|
    |^-- sneak   |
    |         ^--- gap
      ------------
    */
    this.setState({ gap: (width - (2 * sneak) - pageWidth) / 2 });
  }

  _handleScrollEnd(e) {
    const { currentPage } = this.state;
    const { swipeThreshold } = this.props;

    const currentScrollX = e.nativeEvent.contentOffset.x;
    const currentPageScrollX = this._getPageScrollX(currentPage);

    const swiped = (currentScrollX - currentPageScrollX) / this._getPageOffset();

    const pagesSwiped = Math.floor(Math.abs(swiped) + (1 - swipeThreshold)) * Math.sign(swiped);
    const newPage = Math.max(Math.min(currentPage + pagesSwiped, this._getPagesCount() - 1), 0);

    if (newPage !== currentPage) {
      this.setState({ currentPage: newPage });
    } else {
      this._resetScrollPosition();
    }
  };

  _onPageChange(position) {
    if (this.props.onPageChange) {
      this.props.onPageChange(position, currentElement);
      const currentElement = this.props.children[position];
    }
  }

  render() {
    const { gap } = this.state;
    const { sneak, pageWidth } = this.props;
    const computedStyles = StyleSheet.create({
      scrollView: {
        paddingLeft: sneak + gap / 2,
        paddingRight: sneak + gap / 2
      },
      page: {
        width: pageWidth,
        marginLeft: gap / 2,
        marginRight: gap / 2,
        alignItems: 'center',
        justifyContent: "center",
      }
    });

    // if no children render a no items dummy page without callbacks
    let body = null;
    if (!this.props.children) {
      body = (
        <TouchableWithoutFeedback>
          <View style={[Style.page, computedStyles.page, this.props.pageStyle]}>
            <Text style={Style.noItemsText}>
              { this.props.noItemsText }
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      const children = Array.isArray(this.props.children) ?
        this.props.children : [ this.props.children ];

      body = children.map((c, index) => {
        return (
          <TouchableWithoutFeedback
            key={index}
            // onPress={() => this.setState({ currentPage: index })}
          >
            <View
              // style={[Style.page, computedStyles.page, this.props.pageStyle]}
              style={[ computedStyles.page, ]}
            >
              { c }
            </View>
          </TouchableWithoutFeedback>
        );
      });
    }

    return <View style={[ this.props.containerStyle ]}>
      <ScrollView
        bounces
        horizontal
        // pagingEnabled
        decelerationRate={0.9}
        ref={ c => this.scrollView = c }
        showsHorizontalScrollIndicator={ false }
        onScrollEndDrag={ this._handleScrollEnd }
        automaticallyAdjustContentInsets={ false }
        contentContainerStyle={[computedStyles.scrollView]}
        style={{ flexDirection: (I18nManager && I18nManager.isRTL) ? 'row-reverse' : 'row' }}
      >
        { body }
      </ScrollView>
      <View style={{
        left: 0,
        right: 0,
        bottom: 15,
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'center'
      }}>
        {
          (this.props.children.length > 1 && this.props.showPaginator) && Array.apply(null, { length: this.props.children.length }).map((v, i) => (
            <TouchableOpacity key={`dot__${i}`}
              onPress={() => this.setState({ currentPage: i })}
              style={{
                width: 7,
                height: 7,
                borderRadius: 3.5,
                marginHorizontal: 2.5,
                backgroundColor: this.state.currentPage === i ? '#FFF' : 'rgba(255, 255, 255, .47)',
              }} />
          ))
        }
      </View>
    </View>
  }
}

Carousel.propTypes = {
  sneak: PropTypes.number,
  pageStyle: PropTypes.object,
  pageWidth: PropTypes.number,
  onPageChange: PropTypes.func,
  showPaginator: PropTypes.bool,
  noItemsText: PropTypes.string,
  initialPage: PropTypes.number,
  currentPage: PropTypes.number,
  containerStyle: PropTypes.object,
  swipeThreshold: PropTypes.number,
  transitionDelay: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.node, PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

Carousel.defaultProps = {
  sneak: 20,
  initialPage: 0,
  currentPage: 0,
  pageStyle: null,
  transitionDelay: 0,
  showPaginator: true,
  swipeThreshold: 0.5,
  containerStyle: null,
  pageWidth: width - 80,
  noItemsText: "Sorry, there are currently \n no items available",
};