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
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-camera';
import Toolbar from '../components/toolbar'
export default class LectorQR extends Component<{}> {
    static navigationOptions = {
        title: 'Lector QR',
        headerTintColor: 'purple',
        header: null,
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'qrcode-scan' : 'qrcode-scan'}
                size={25}
                color={focused ? tintColor : '#9e9e9e'}
            />
        ),

    };
    _handleBarCodeRead(e) {
        Vibration.vibrate();
        this.setState({
            scanning: false,
            buscandoInvitacion: true,
            resultado: e.data
        });

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_qr: e.data,
                id_usuario: this.state.id
            })
        }
        fetch(URL_WS_SOCKET + "/ws/VerificacionCodigo", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    if (responseJson.invitacion.length > 0) {
                        this.setState({
                            buscandoInvitacion: false,
                            codigoqr_des_encontrado: responseJson.invitacion[0].codigoqr_des,
                            respuestaScanner: responseJson.invitacion[0].estado == "WAIT" ? true : false,
                            codigoEncontrado: true
                        })
                    } else {
                        this.setState({
                            buscandoInvitacion: false,
                            codigoEncontrado: false,
                        })
                    }
                } else {
                    this.setState({ buscandoInvitacion: false })

                }
            })
            .catch(err => {
                this.setState({ buscandoInvitacion: false })
            })

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
        const { navigate } = this.props.navigation;
        const { scanning, es_empresa,
            buscandoInvitacion, codigoEncontrado,
            respuestaScanner, codigoqr_des_encontrado } = this.state
            
        if (this.state.scanning) {
            return (
                <View style={styles.container}>
                    <Toolbar navigation={navigate} banner={"Scanner Code"} />
                    <View style={styles.rectangleContainer}>
                        <Camera style={styles.camera}
                            type={this.state.cameraType}
                            onBarCodeRead={this._handleBarCodeRead.bind(this)}>
                            <View style={styles.rectangleContainer}>
                                <View style={styles.rectangle} />
                            </View>
                        </Camera>
                    </View>
                    <Text style={styles.instructions}>
                        Escanee el codigo QR
                    </Text>
                </View>
            );
        }
        else {
            return (
                <View style={{ alignItems: 'center' }}>
                    {(buscandoInvitacion) ?
                        <View>
                            <Image source={require('../assets/img/loading.gif')}
                                style={{ marginVertical: 10, height: 80, width: 80, alignSelf: 'center' }} />
                            <Text>Buscando ...</Text>
                        </View> :
                        codigoEncontrado ?
                            <View style={{ alignItems: 'center' }}>
                                <Icon name="ios-checkmark-circle-outline" color={"#2ecc71"} size={100} />
                                <Text>{codigoqr_des_encontrado}</Text>
                                <TouchableOpacity onPress={() => this.setState({ scanning: true })}
                                    style={{ marginVertical: 10, borderColor: '#831da2', padding: 10, borderWidth: 1, borderRadius: 10 }}>
                                    <Text>OK</Text>
                                </TouchableOpacity>
                            </View>
                            : es_empresa == "SI" && <View style={{ alignItems: 'center' }}>
                                <Icon name="ios-close-circle-outline" color={"#c0392b"} size={100} />
                                <Text>No se encontro</Text>
                                <TouchableOpacity onPress={() => this.setState({ scanning: true })}
                                    style={{ marginVertical: 10, borderColor: '#831da2', padding: 10, borderWidth: 1, borderRadius: 10 }}>
                                    <Text>OK</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
