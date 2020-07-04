import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

// Screens
import TakePhoto from '@Screens/TakePhoto';
import TakeVideo from '@Screens/TakeVideo';
import SelectImages from '@Screens/ImageSelector';


const Tab = createBottomTabNavigator();


const TabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return <SafeAreaView pointerEvents="box-none" style={{
    left: 50,
    right: 50,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    bottom: insets.bottom ? 0 : 15,
  }}>
    {
      state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return <TouchableOpacity
          onPress={onPress}
          activeOpacity={.8}
          onLongPress={onLongPress}
          accessibilityRole="button"
          key={`route__tab__${index}`}
          testID={options.tabBarTestID}
          accessibilityStates={isFocused ? ['selected'] : []}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          style={{
            width: 50,
            height: 50,
            borderWidth: 1,
            borderRadius: 25,
            alignItems: 'center',
            backgroundColor: '#FFF',
            justifyContent: 'center',
            borderColor: isFocused ? '#FEA0A8' : '#F4F7FD',
            elevation: 2,
            shadowRadius: 11,
            shadowOpacity: 1,
            shadowColor: '#F0F6FF',
            shadowOffset: { width: 0, height: 5 },
          }}
        >
          {
            index === 0 && <Feather name="image" style={{
              fontSize: 24,
              color: isFocused ? '#000' : '#8A97AD'
            }} />
          }
          {
            index === 1 && <Feather name="camera" style={{
              fontSize: 24,
              color: isFocused ? '#000' : '#8A97AD'
            }} />
          }
          {
            index === 2 && <Feather name="video" style={{
              fontSize: 24,
              color: isFocused ? '#000' : '#8A97AD'
            }} />
          }
        </TouchableOpacity>
      })
    }
  </SafeAreaView>
}


export default () => (
  <Tab.Navigator tabBar={(props) => <TabBar { ...props } />}>
    <Tab.Screen name="SelectImages" component={SelectImages} />
    <Tab.Screen name="TakePhoto" component={TakePhoto} />
    <Tab.Screen name="TakeVideo" component={TakeVideo} />
  </Tab.Navigator>
)