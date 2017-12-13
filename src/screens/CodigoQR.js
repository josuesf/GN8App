/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  Dimensions,
  Vibration,
  Button,
} from 'react-native';
import QRCode from 'react-native-qrcode';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
//import QRCodeScanner from 'react-native-qrcode-scanner';
import Camera from 'react-native-camera';
export default class CodigoQR extends Component<{}> {
    static navigationOptions = {
        title: 'Crear codigo QR',
        headerTintColor:'purple',
        header:null,
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'qrcode' : 'qrcode'}
                size={25}
                color={focused ? tintColor : '#9e9e9e'}
            />
        ),
    };
  _handleBarCodeRead(e) {
    Vibration.vibrate();
    this.setState({ scanning: false,resultado:e.data });
    //Linking.openURL(e.data).catch(err => console.error('An error occured', err));

    return;
  }
  state={
    scanning:true,
    resultado:'',
  }
  getInitialState() {
    return {
      scanning: true,
      cameraType: Camera.constants.Type.back
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
        <View style={styles.container}>
        <Toolbar navigation={navigate} banner={"Invitaciones"} />
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({text: text})}
            value={this.state.text}
          />
          <QRCode
            value={this.state.text}
            size={200}
            bgColor='purple'
            fgColor='white'/>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
});
