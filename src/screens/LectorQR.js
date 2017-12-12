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
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
//import QRCodeScanner from 'react-native-qrcode-scanner';
import Camera from 'react-native-camera';
export default class LectorQR extends Component<{}> {
    static navigationOptions = {
        title: 'Lector QR',
        headerTintColor: 'green',
        
    };
    _handleBarCodeRead(e) {
        Vibration.vibrate();
        this.setState({ scanning: false, resultado: e.data });
        //Linking.openURL(e.data).catch(err => console.error('An error occured', err));

        return;
    }
    state = {
        scanning: true,
        resultado: '',
    }
    getInitialState() {
        return {
            scanning: true,
            cameraType: Camera.constants.Type.back
        }
    }
    render() {
        if (this.state.scanning) {
            return (
                <View style={styles.container}>
                    <Text style={styles.welcome}>
                        Barcode Scanner
        </Text>
                    <View style={styles.rectangleContainer}>
                        <Camera style={styles.camera} type={this.state.cameraType} onBarCodeRead={this._handleBarCodeRead.bind(this)}>
                            <View style={styles.rectangleContainer}>
                                <View style={styles.rectangle} />
                            </View>
                        </Camera>
                    </View>
                    <Text style={styles.instructions}>
                        Double tap R on your keyboard to reload,{'\n'}
                    </Text>
                </View>
            );
        }
        else {
            return (<View style={styles.container}>
                <Text style={styles.welcome}>
                    Barcode Scanner
        </Text>
                <Text style={styles.instructions}>
                    {this.state.resultado}
                </Text>
                <TouchableOpacity onclick={() => this.setState({ scanning: true })}><Text>Intentar nuevamente</Text></TouchableOpacity>
            </View>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
