/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flowsds
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { URL_WS } from '../Constantes'
const { width, height } = Dimensions.get('window')
import { NavigationActions } from 'react-navigation'
export default class Registro extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    state = {
        correo: '',
        nombre: '',
        errorUsuario: false,
        cargando: false
    }
    VerificarUsuario = () => {
        this.setState({ cargando: true })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.correo.toLowerCase().trim()
            })
        }
        fetch(URL_WS + '/ws/isuser', parametros)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.res != "ok") {
                    Keyboard.dismiss();
                    const main = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate(
                                {
                                    routeName: 'registrodetalle',
                                    params: {
                                        user: this.state.correo,
                                        photoUrl: 'sin_imagen',
                                        nombre: this.state.nombre,
                                    }
                                })
                        ]
                    })
                    this.props.navigation.dispatch(main)
                } else {
                    this.setState({ errorUsuario: true })
                }
                this.setState({ cargando: false })
            })
            .catch(err => alert(err))
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 30 }}>
                    <Text style={{ color: '#2c3e50', textAlign: 'center', fontSize: 20 }}>Ingresa tu correo, nombre y contrasena</Text>
                </View>
                {this.state.errorUsuario && <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ color: 'red' }}>Este usuario ya existe,intente con otro</Text>
                </View>}
                {this.state.cargando && <View style={{ padding: 10, marginBottom: 10 }}>
                    <ActivityIndicator size="large" color="#9575cd" />
                </View>}
                <View style={{
                    borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0',
                    backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
                    justifyContent: 'center', height: 50
                }}>
                    <TextInput onChangeText={(text) => this.setState({ correo: text })}
                        placeholder="Correo" placeholderTextColor="#9e9e9e"
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={{
                    borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0',
                    backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
                    justifyContent: 'center', height: 50
                }}>
                    <TextInput onChangeText={(text) => this.setState({ nombre: text })}
                        placeholder="Nombre completo" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>

                {(this.state.correo.length == 0 || this.state.nombre.length == 0) &&
                    <View style={{
                        borderWidth: 1, borderRadius: 5, borderColor: '#d1c4e9',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                    }}
                    >
                        <Text style={{ color: '#d1c4e9', fontWeight: 'bold' }}>CONTINUAR</Text>
                    </View>
                }
                {this.state.correo.length > 0 && this.state.nombre.length > 0 &&
                    <TouchableOpacity activeOpacity={0.8}
                        style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#9575cd', backgroundColor: '#9575cd',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}
                        onPress={this.VerificarUsuario}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>CONTINUAR</Text>
                    </TouchableOpacity>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
