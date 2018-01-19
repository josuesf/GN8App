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
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-camera';
import Toolbar from '../components/toolbar'
import { URL_WS_SOCKET } from '../Constantes'
import store from '../store';
import Boton from '../components/Boton';
export default class LectorQR extends Component<{}> {
    static navigationOptions = {
        title: 'Escaner',
        headerTintColor: 'purple',
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
                id_usuario: store.getState().id
            })
        }
        fetch(URL_WS_SOCKET + "/ws/VerificacionCodigo", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    console.log(responseJson)
                    this.setState({
                        buscandoInvitacion: false,
                        codigoqr_des_encontrado: responseJson.invitacion.codigoqr_des,
                        respuestaScanner: responseJson.invitacion.estado == "CHECK" ? true : false,
                        codigoEncontrado: true
                    })
                } else {
                    this.setState({ buscandoInvitacion: false, codigoEncontrado: false })

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
        buscandoInvitacion: true,
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
                <View style={styles.container}>
                    {(this.state.buscandoInvitacion) ?
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../assets/img/loading.gif')}
                                style={{ marginVertical: 10, height: 80, width: 80, alignSelf: 'center' }} />
                            <Text>Buscando ...</Text>
                        </View> :
                        this.state.codigoEncontrado ?
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', marginVertical: 20 }}>
                                    {codigoqr_des_encontrado}
                                </Text>
                                <Icon name="ios-checkmark-circle-outline" color={"#2ecc71"} size={100} />
                                <Boton text="CONFIRMAR CODIGO" 
                                    onPress={() => this.setState({ scanning: true })}
                                    styleBoton={{ backgroundColor: '#2ecc71', borderRadius: 10, marginVertical: 20 }}
                                    styleText={{ color: '#fff', fontWeight: 'bold' }}
                                />

                            </View>
                            : <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', marginVertical: 20 }}>
                                    No se encontro
                                </Text>
                                <Icon name="ios-close-circle-outline" color={"#c0392b"} size={100} />

                                <Boton text="Reintentar" onPress={() => this.setState({ scanning: true })}
                                    styleBoton={{ backgroundColor: '#c0392b', borderRadius: 10, marginVertical: 20 }}
                                    styleText={{ color: '#fff', fontWeight: 'bold' }}
                                />
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
        borderColor: '#9b59b6',
        backgroundColor: 'transparent',
    },
});
