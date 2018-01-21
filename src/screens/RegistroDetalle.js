/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flowds
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
    Keyboard,
    Image,
    AsyncStorage,
    ActivityIndicator,
    Alert,
} from 'react-native';
const { width, height } = Dimensions.get('window')
import { URL_WS, URL_WS_SOCKET } from '../Constantes'
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'

export default class RegistroDetalle extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    constructor() {
        super()
        this.state = {
            correo: '',
            nombre: '',
            usuario: '',
            photoUrl: '',
            password: '',
            direccion:'',
            dataImg:'',
            telefono:'',
            cargando: false,
            errorUsuario: false,
            avatarSource: null,
            videoSource: null
        }
    }
    componentWillMount() {
        const { state } = this.props.navigation;
        if (state.params.esEmpresa!="SI")
            this.setState({
                usuario: state.params.user.split("@")[0],
                photoUrl: state.params.photoUrl,
                correo: state.params.user,
                nombre: state.params.nombre,
                esEmpresa:"NO"
            })
        else
            this.setState({
                usuario: state.params.user.split("@")[0],
                photoUrl: state.params.photoUrl,
                correo: state.params.user,
                nombre: state.params.nombre,
                direccion: state.params.direccion,
                dataImg: state.params.dataImg,
                telefono: state.params.telefono,
                esEmpresa:"SI"
            })
    }
    RegistrarUsuarioComun=()=>{
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.nombre,
                username: (this.state.usuario).toLocaleLowerCase().trim(),
                email: (this.state.correo).toLocaleLowerCase().trim(),
                password: this.state.password,
                photo_url: this.state.photoUrl,
                es_empresa: this.state.esEmpresa,
            })
        }
        console.log(parametros)
        fetch(URL_WS_SOCKET + '/ws/signup', parametros)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.res == "ok") {
                    const user = responseJson.user
                    const user_data = {
                        id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        photo_url: user.photo_url,
                        es_empresa:user.es_empresa,
                    }
                    AsyncStorage.setItem('USER_DATA', JSON.stringify(user_data), () => {
                        const main = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate(
                                    {
                                        routeName: 'main',
                                    })
                            ]
                        })
                        this.props.navigation.dispatch(main)
                    }).catch(err => console.log('Error'));
                } else {
                    this.setState({ errorUsuario: true })
                }
                this.setState({ cargando: false })
                Keyboard.dismiss();

            })
            .catch((error) => {
                this.setState({ cargando: false })
                Alert.alert('Error', 'Ocurrio un error, compruebe su conexion a internet')
            });
    }
    RegistrarUsuarioEmpresa=()=>{
        const data = [
            { name: 'name', data: this.state.nombre },
            { name: 'username', data: (this.state.usuario).toLocaleLowerCase().trim() },
            { name: 'email', data: (this.state.correo).toLocaleLowerCase().trim() },
            { name: 'password', data: this.state.password },
            { name: 'telefono', data: this.state.telefono },
            { name: 'direccion', data: this.state.direccion },
            { name: 'es_empresa', data: "SI" },
            { name: 'picture', filename: Date.now().toString()+'.png', data: this.state.dataImg }
        ]
        
        RNFetchBlob.fetch('POST', URL_WS_SOCKET + "/ws/signupEmpresa", {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, data)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.res == "ok") {
                    const user = responseJson.user
                    const user_data = {
                        id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        photo_url: user.photo_url,
                        es_empresa:user.es_empresa,
                        direccion:user.direccion,
                        telefono:user.telefono,

                    }
                    AsyncStorage.setItem('USER_DATA', JSON.stringify(user_data), () => {
                        const main = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate(
                                    {
                                        routeName: 'main',
                                    })
                            ]
                        })
                        this.props.navigation.dispatch(main)
                    }).catch(err => console.log('Error'));
                } else {
                    this.setState({ errorUsuario: true })
                }
                this.setState({ cargando: false })
                Keyboard.dismiss();

            })
            .catch((error) => {
                console.log(error)
                this.setState({ cargando: false })
                Alert.alert('Error', 'Ocurrio un error, compruebe su conexion a internet')
            });
    }
    RegistrarUsuario = () => {
        Keyboard.dismiss()
        this.setState({ cargando: true })
        if(this.state.esEmpresa=="SI"){
            this.RegistrarUsuarioEmpresa()
        }else{
            this.RegistrarUsuarioComun()
        }
        
    }

    render() {
        const { navigate, state } = this.props.navigation;

        const photo = state.params.photoUrl && state.params.photoUrl != "sin_imagen" ?
            <Image source={{ uri: state.params.photoUrl }} style={{ borderRadius: 75, height: 150, width: 150 }} resizeMode="contain" />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />
        return (
            <View style={styles.container}>

                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 20 }}>
                    <Text style={{ color: '#2c3e50', textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Agrega un nombre de usuario.</Text>
                </View>
                {this.state.errorUsuario && <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ color: 'red' }}>Este usuario ya existe,intente con otro</Text>
                </View>}
                {this.state.cargando && <View style={{ padding: 10, marginBottom: 10 }}>
                    <ActivityIndicator size="large" color="#9575cd" />
                </View>}
                <View style={{
                    borderWidth: 1, borderRadius: 2, height: 50, justifyContent: 'center',
                    borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5,
                    marginBottom: 10
                }}>

                    <TextInput
                        onChangeText={(text) => this.setState({ usuario: text })}
                        value={this.state.usuario} autoCapitalize="none"
                        placeholder="Usuario" placeholderTextColor="#9e9e9e"
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <Text style={{ color: '#bdc3c7' }}>Debes tener al menos 6 caracteres en tu clave.</Text>
                <View style={{
                    borderWidth: 1, borderRadius: 2, borderColor: '#e0e0e0',
                    backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
                    justifyContent: 'center', height: 50
                }}>

                    <TextInput onChangeText={(text) => this.setState({ password: text })}
                        placeholder="Contrasena" placeholderTextColor="#9e9e9e" secureTextEntry={true} underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>

                {(this.state.usuario.length == 0 || this.state.password.length < 6) &&
                    <View style={{
                        borderWidth: 1, borderRadius: 2, borderColor: '#d1c4e9',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                    }}
                    >
                        <Text style={{ color: '#d1c4e9', fontWeight: 'bold' }}>CONTINUAR</Text>
                    </View>
                }
                {this.state.usuario.length > 0 && this.state.password.length > 5 &&
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
                        onPress={this.RegistrarUsuario}>
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
