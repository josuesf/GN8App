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
    Alert,
} from 'react-native';
import { URL_WS } from '../Constantes'
const { width, height } = Dimensions.get('window')
import { NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

export default class RegistroEmpresa extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    state = {
        correo: '',
        nombre: '',
        errorUsuario: false,
        cargando: false,
        avatarSource: null,
    }
    VerificarUsuario = () => {
        Keyboard.dismiss()
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
                                        esEmpresa: 'SI',
                                        direccion: this.state.direccion,
                                        dataImg: this.state.dataImg,
                                        telefono:this.state.telefono,
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
            .catch((error) => {
                this.setState({ cargando: false })
                Alert.alert('Error', 'Ocurrio un error, compruebe su conexion a internet')

            });
    }
    selectPhotoTapped() {
        const options = {
            title: 'Seleciona una imagen',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Toma una foto',
            chooseFromLibraryButtonTitle: 'Escoge una de tu galeria',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    avatarSource: source,
                    dataImg: response.data
                });
            }
        });
    }
    render() {
        const { navigate } = this.props.navigation;
        const photo = this.state.avatarSource ?
            <Image style={styles.avatar} source={this.state.avatarSource} />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" />

        return (
            <View style={styles.container}>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 30 }}>
                    <Text style={{ color: '#2c3e50', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Registro como Empresa</Text>
                </View>
                {this.state.errorUsuario && <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ color: 'red' }}>Ya existe un usuario registrado con este correo</Text>
                </View>}
                {this.state.cargando && <View style={{ padding: 10, marginBottom: 10 }}>
                    <ActivityIndicator size="large" color="#9575cd" />
                </View>}
                <View style={{ flexDirection: 'row',alignItems:'center',marginBottom:20 }}>
                    <TouchableOpacity style={{ alignItems:'center'}} activeOpacity={0.8}
                        onPress={this.selectPhotoTapped.bind(this)}>
                        {photo}
                        <Text style={{ color: '#3498db' }}>Cambiar imagen</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.boxInput}>
                    <TextInput autoCorrect={false} onChangeText={(text) => this.setState({ nombre: text })}
                        placeholder="Nombre completo" placeholderTextColor="#9e9e9e"
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={styles.boxInput}>
                    <TextInput onChangeText={(text) => this.setState({ direccion: text })}
                         autoCorrect={false} placeholder="Direccion" placeholderTextColor="#9e9e9e"
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={styles.boxInput}>
                    <TextInput autoCorrect={false} autoCapitalize="none" keyboardType="email-address"
                        onChangeText={(text) => this.setState({ correo: text })}
                        placeholder="Correo" placeholderTextColor="#9e9e9e"
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={[styles.boxInput]}>
                    <TextInput autoCapitalize="none" keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ telefono: text })}
                        placeholder="Telefono" placeholderTextColor="#9e9e9e"
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>


                {(this.state.correo.length == 0 || this.state.nombre.length == 0) &&
                    <View style={{

                        borderWidth: 1, borderRadius: 2, borderColor: '#d1c4e9',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                    }}
                    >
                        <Text style={{ color: '#d1c4e9', fontWeight: 'bold' }}>CONTINUAR</Text>
                    </View>
                }
                {this.state.correo.length > 0 && this.state.nombre.length > 0 &&
                    <TouchableOpacity activeOpacity={0.8}
                        disabled={this.state.cargando}
                        style={{
                            shadowOffset: {
                                width: 5,
                                height: 5,
                            },
                            shadowColor: 'black',
                            shadowOpacity: 0.4, elevation: 5,
                            borderWidth: 1, borderRadius: 2, borderColor: '#9575cd', backgroundColor: '#9575cd',
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
    boxInput: {
        borderWidth: 1, borderRadius: 2, borderColor: '#e0e0e0',
        backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
        justifyContent: 'center', height: 50
    },
    avatar: {
        borderRadius: 10,
        width: 100,
        height: 100
    }
});
