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
import ListaInvitaciones from '../components/ListaInvitaciones'

//import QRCodeScanner from 'react-native-qrcode-scanner';
import Camera from 'react-native-camera';
export default class Invitaciones extends Component<{}> {
    static navigationOptions = {
        title: 'Invitaciones',
        headerTintColor:'purple',
        header:null,
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'qrcode' : 'qrcode'}
                size={25}
                color={focused ? tintColor : '#d1c4e9'}
            />
        ),
    };
  constructor(){
    super()
    this.state={
      scanning:true,
      resultado:'',
      invitaciones:[],

    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
        <View style={styles.container}>
        <Toolbar navigation={navigate} banner={"Invitaciones"} />
          <ListaInvitaciones invitaciones={this.state.invitaciones} />
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
