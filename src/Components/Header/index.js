import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';


export const HEADER_HEIGHT = 60;

const styles = StyleSheet.create({
  nextButtonActive: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#F4F7FD',
    backgroundColor: '#FFF',

    elevation: 2,
    shadowRadius: 15,
    shadowOpacity: 1,
    shadowColor: '#F0F6FF',
    shadowOffset: { width: 0, height: 5 },
  },
  nextButtonTextActive: {
    fontSize: 16,
    color: '#FEA0A8',
    letterSpacing: -0.9,
    fontFamily: 'Muli-ExtraBold',
  },
  nextButtonInactive: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F4F7FD',
  },
  nextButtonTextInactive: {
    fontSize: 14,
    color: '#8A97AD',
    fontFamily: 'Muli-Bold',
  }
});


const Header = ({ title, titleStyle, titleIcon }) => {
  const navigation = useNavigation();
  const isActive = useSelector(({ core }) => !!core.resources.length);

  return <View style={{
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    height: HEADER_HEIGHT,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  }}>
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} activeOpacity={1}>
        <Image source={require('@Assets/images/back.png')} />
      </TouchableOpacity>
    </View>
    <View style={{
      flex: 2,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    }}>
      <Text style={[{
        fontSize: 18,
        color: '#000',
        marginRight: 5,
        textAlign: 'center',
        letterSpacing: -0.9,
      }, titleStyle]}>
        { title }
      </Text>
      { !!titleIcon && titleIcon }
    </View>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'flex-end',
    }}>
      <TouchableOpacity onPress={() => isActive && navigation.navigate('Publish')} activeOpacity={1} style={isActive ? styles.nextButtonActive : styles.nextButtonInactive}>
        <Text style={isActive ? styles.nextButtonTextActive : styles.nextButtonTextInactive}>
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  </View>
}

export default Header;
