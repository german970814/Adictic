import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Video from 'react-native-video';
import Header from '@Components/Header';
import { Switch } from '@Components/Switch';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { View, Text, SafeAreaView, Image, TextInput, StyleSheet, ScrollView } from 'react-native';


const styles = StyleSheet.create({
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
    fontFamily: 'Muli-Bold',
  },
  itemContainer: {
    height: 60,
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderColor: '#F4F7FD',
  }
});

const mapStateToProps = ({ core }) => ({ ...core });

class PublishScreen extends React.Component {
  state = {
    switchs: {
      twitter: true,
      secured: false,
      facebook: false,
      instagram: true,
    },
  }

  get resource() {
    return _.first(this.props.resources);
  }

  handleSwitchChange = (key, value) => {
    this.setState({
      switchs: { ...this.state.switchs, [key]: value }
    })
  }

  render() {
    return <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header title="Nueva publicación" titleStyle={{
        fontSize: 18,
        color: '#000',
        marginRight: 5,
        textAlign: 'center',
        fontFamily: 'Muli-ExtraBold',
      }} />
      <ScrollView bounces={false} contentContainerStyle={{ flex: 1 }} style={{ marginHorizontal: 20 }}>
        <View style={{
          flexDirection: 'row',
        }}>
          {
            !!this.resource && this.resource.type === 'image' && <Image
              style={{ width: 65, height: 65, borderRadius: 10 }}
              source={{ uri: this.resource.data }} />
          }
          {
            !!this.resource && this.resource.type === 'video' && <Video
              paused
              resizeMode="cover"
              source={{ uri: this.resource.data }}
              style={{ width: 65, height: 65, borderRadius: 10 }}
            />
          }
          <TextInput
            multiline
            placeholderTextColor="#CDD4E0"
            placeholder="Escribe un pie de foto para esta imagen"
            style={{ marginLeft: 15, flex: 1, maxHeight: 65, fontFamily: 'Muli-Regular' }}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={styles.itemContainer}>
            <Image resizeMode="contain" style={{ width: 22 }} source={require('@Assets/images/tag.png')} />
            <Text style={styles.itemText}>
              Etiquetar personas
            </Text>
            <FontAwesome style={{ color: '#CDD4E0', fontSize: 21 }} name="angle-right" />
          </View>
          <View style={styles.itemContainer}>
            <Image resizeMode="contain" style={{ width: 22 }} source={require('@Assets/images/product.png')} />
            <Text style={styles.itemText}>
              Etiquetar productos
            </Text>
            <FontAwesome style={{ color: '#CDD4E0', fontSize: 21 }} name="angle-right" />
          </View>
          <View style={styles.itemContainer}>
            <Image resizeMode="contain" style={{ width: 22 }} source={require('@Assets/images/hash.png')} />
            <Text style={styles.itemText}>
              Agregar hashtags
            </Text>
            <FontAwesome style={{ color: '#CDD4E0', fontSize: 21 }} name="angle-right" />
          </View>
          <View style={styles.itemContainer}>
            <Image resizeMode="contain" style={{ width: 22 }} source={require('@Assets/images/pin.png')} />
            <Text style={styles.itemText}>
              Agregar ubicación
            </Text>
            <FontAwesome style={{ color: '#CDD4E0', fontSize: 21 }} name="angle-right" />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={{
              fontSize: 16,
              color: '#000',
              fontFamily: 'Muli-Bold',
            }}>
              Facebook
            </Text>
            <Switch
              barHeight={32}
              circleSize={22}
              switchLeftPx={2}
              switchRightPx={2}
              circleBorderWidth={0}
              changeValueImmediately
              renderActiveText={false}
              circleActiveColor="#FFF"
              backgroundActive="#A0FED6"
              renderInActiveText={false}
              circleInActiveColor="#FFF"
              switchWidthMultiplier={2.5}
              backgroundInactive="#FEA0A8"
              value={this.state.switchs.facebook}
              onValueChange={(value) => this.handleSwitchChange('facebook', value)}
              innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
              renderInsideCircle={() => <View style={{ backgroundColor: this.state.switchs.facebook ? '#A0FED6' : '#FEA0A8', height: 10, width: 10, borderRadius: 5  }} />}
            />
          </View>
          <View style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={{
              fontSize: 16,
              color: '#000',
              fontFamily: 'Muli-Bold',
            }}>
              Twitter
            </Text>
            <Switch
              barHeight={32}
              circleSize={22}
              switchLeftPx={2}
              switchRightPx={2}
              circleBorderWidth={0}
              changeValueImmediately
              renderActiveText={false}
              circleActiveColor="#FFF"
              backgroundActive="#A0FED6"
              renderInActiveText={false}
              circleInActiveColor="#FFF"
              switchWidthMultiplier={2.5}
              backgroundInactive="#FEA0A8"
              value={this.state.switchs.twitter}
              onValueChange={(value) => this.handleSwitchChange('twitter', value)}
              innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
              renderInsideCircle={() => <View style={{ backgroundColor: this.state.switchs.twitter ? '#A0FED6' : '#FEA0A8', height: 10, width: 10, borderRadius: 5  }} />}
            />
          </View>
          <View style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={{
              fontSize: 16,
              color: '#000',
              fontFamily: 'Muli-Bold',
            }}>
              Instagram
            </Text>
            <Switch
              barHeight={32}
              circleSize={22}
              switchLeftPx={2}
              switchRightPx={2}
              circleBorderWidth={0}
              changeValueImmediately
              renderActiveText={false}
              circleActiveColor="#FFF"
              backgroundActive="#A0FED6"
              renderInActiveText={false}
              circleInActiveColor="#FFF"
              switchWidthMultiplier={2.5}
              backgroundInactive="#FEA0A8"
              value={this.state.switchs.instagram}
              onValueChange={(value) => this.handleSwitchChange('instagram', value)}
              innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
              renderInsideCircle={() => <View style={{ backgroundColor: this.state.switchs.instagram ? '#A0FED6' : '#FEA0A8', height: 10, width: 10, borderRadius: 5  }} />}
            />
          </View>
        </View>
        <View style={{
          flex: 1,
          paddingTop: 40,
          paddingBottom: 40,
          justifyContent: 'flex-end'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Switch
              barHeight={32}
              circleSize={22}
              switchLeftPx={2}
              switchRightPx={2}
              circleBorderWidth={0}
              changeValueImmediately
              renderActiveText={false}
              circleActiveColor="#FFF"
              backgroundActive="#A0FED6"
              renderInActiveText={false}
              circleInActiveColor="#FFF"
              switchWidthMultiplier={2.5}
              backgroundInactive="#FEA0A8"
              value={this.state.switchs.secured}
              onValueChange={(value) => this.handleSwitchChange('secured', value)}
              innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
              renderInsideCircle={() => <View style={{ backgroundColor: this.state.switchs.secured ? '#A0FED6' : '#FEA0A8', height: 10, width: 10, borderRadius: 5  }} />}
            />
            <Text style={{
              flex: 1,
              fontSize: 14,
              marginLeft: 10,
              color: '#8A97AD',
              alignContent: 'center',
              fontFamily: 'Muli-Light',
            }}>
              Protege este contenido bajo suscripción
            </Text>
            <View style={{
              width: 32,
              height: 32,
              borderWidth: 1,
              borderRadius: 16,
              alignItems: 'center',
              borderColor: '#CDD4E0',
              justifyContent: 'center',
            }}>
              <Feather name="edit-2" style={{ fontSize: 17, color: '#CDD4E0' }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  }
}

export default connect(mapStateToProps)(PublishScreen);
