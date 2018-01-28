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
    Dimensions,
    StatusBar,
    Image, Keyboard,
    ActivityIndicator,
    AsyncStorage,
    Alert,
} from 'react-native';
import { URL_WS,URL_WS_SOCKET } from '../Constantes'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationActions } from 'react-navigation'
import { ProgressDialog } from 'react-native-simple-dialogs';
import FBSDK, {
    LoginButton,
    AccessToken,
    LoginManager,
    GraphRequestManager, GraphRequest,
} from 'react-native-fbsdk'
const { width, height } = Dimensions.get('window')
export default class Login extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    state = {
        scanning: true,
        resultado: '',
        email: '',
        password: '',
        errorLogin: false,
        cargando: false
    }
    loginFB = () => {
        this.setState({ progressVisible: true, progressVisible: true })
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then((result) => {
            if (result.isCancelled) {
                console.log('loging cancelled')
            }
            else {
                console.log('login success' + result.grantedPermissions)

                const infoRequest = new GraphRequest('/me', {
                    parameters: {
                        'fields': {
                            'string': 'email,first_name,last_name,picture,name'
                        }
                    }
                }, (err, res) => {
                    if (err) {
                        this.setState({ progressVisible: false })
                        alert('Intente mas luego...')
                    } else {
                        //Preguntar si este id ya fue registrado
                        const parametros = {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: res.email,
                            })
                        }
                        fetch(URL_WS_SOCKET + '/ws/isuser', parametros)
                            .then((response) => response.json())
                            .then((responseJson) => {
                                if (responseJson.res != "ok") {
                                    //Si no fue registrado
                                    const user_data = {
                                        id: res.id,
                                        name: res.name,
                                        first_name: res.first_name,
                                        last_name: res.last_name,
                                        email: res.email,
                                        picture: 'https://graph.facebook.com/' + res.id + '/picture?height=200&width=200' //res.picture.data.url,
                                        //https://graph.facebook.com/1501027589955221/picture?height=350&width=250
                                    }
                                    if (res.email != null && res.email != "") {
                                        const main = NavigationActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate(
                                                    {
                                                        routeName: 'registrodetalle',
                                                        params: { user: user_data.email, photoUrl: user_data.picture, nombre: res.name }
                                                    })
                                            ]
                                        })
                                        this.props.navigation.dispatch(main)
                                    } else {
                                        const main = NavigationActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate(
                                                    {
                                                        routeName: 'registro',
                                                        params: { user: user_data.email, photoUrl: user_data.picture }
                                                    })
                                            ]
                                        })
                                        this.props.navigation.dispatch(main)
                                    }
                                } else {
                                    //Si ya fue registrado
                                    const user = responseJson.user
                                    const user_data = {
                                        id: user._id,
                                        username: user.username,
                                        name: user.name,
                                        email: user.email,
                                        password: user.password,
                                        photo_url: user.photo_url,
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

                                }
                            })
                            .catch((error) => {
                                this.setState({ cargando: false, progressVisible: false })
                                Alert.alert('Error', 'Ocurrio un error, compruebe su conexion a internet')
                            });




                    }

                });
                new GraphRequestManager().addRequest(infoRequest).start();

            }
        }, (error) => {

            this.setState({ progressVisible: false })
            Alert.alert('Error', 'Ocurrio un error, compruebe su conexion a internet')
        })
    }
    login = () => {
        Keyboard.dismiss();
        this.setState({ cargando: true })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: (this.state.email).toLocaleLowerCase().trim(),
                password: this.state.password
            })
        }
        fetch(URL_WS_SOCKET + '/ws/signin', parametros)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.res == 'ok') {
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
                        categorias:user.categorias,
                    }
                    console.log(user_data)
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
                    this.setState({ errorLogin: true })
                }
                this.setState({ cargando: false })
            })
            .catch((error) => {
                console.log(error)
                this.setState({ cargando: false, progressVisible: false })
                Alert.alert('Error', 'Ocurrio un error, compruebe su conexion a internet')

            });
    }
    render() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'registroMain' })
            ]
        })
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="black" barStyle="light-content" />
                <View style={{ height: height / 3 }}>

                </View>
                <View style={{ height: height / 3 }}>

                    {this.state.errorLogin && <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ color: 'red' }}>Verifique su correo y contrasena</Text>
                    </View>}
                    {this.state.cargando && <View style={{ padding: 10, marginBottom: 10 }}>
                        <ActivityIndicator size="large" color="#9575cd" />
                    </View>}
                    <View style={{
                        borderWidth: 1, borderRadius: 2, height: 40, borderColor: '#e0e0e0',
                        backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
                        justifyContent: 'center', height: 50
                    }}>
                        <TextInput autoCapitalize="none" onChangeText={(text) => this.setState({ email: text })}
                            placeholder="Email" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                    </View>
                    <View style={{
                        borderWidth: 1, borderRadius: 2, borderColor: '#e0e0e0',
                        backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
                        justifyContent: 'center', height: 50
                    }}>
                        <TextInput autoCapitalize="none" onChangeText={(text) => this.setState({ password: text })}
                            secureTextEntry={true} placeholder="Contraseña" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                    </View>
                    {(this.state.email.length == 0 || this.state.password.length == 0) &&
                        <View style={{
                            borderWidth: 1, borderRadius: 2, borderColor: '#d1c4e9',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}>
                            <Text style={{ color: '#d1c4e9', fontWeight: 'bold' }}>INICIAR SESION</Text>
                        </View>
                    }
                    {this.state.email.length > 0 && this.state.password.length > 0 &&
                        <TouchableOpacity activeOpacity={0.8}
                            disabled={this.state.cargando}
                            style={{
                                shadowOffset: {
                                    width: 5,
                                    height: 5,
                                },
                                shadowColor: 'black',
                                shadowOpacity: 0.4,elevation: 5,
                                borderWidth: 1, borderRadius: 2, borderColor: '#9575cd', backgroundColor: '#9575cd',
                                width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                            }}
                            onPress={this.login}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>INICIAR SESION</Text>
                        </TouchableOpacity>}

                    <TouchableOpacity activeOpacity={0.8}
                        disabled={this.state.cargando}
                        style={{
                            shadowOffset: {
                                width: 5,
                                height: 5,
                            },
                            shadowColor: 'black',
                            shadowOpacity: 0.4,elevation: 5,
                            borderWidth: 1, borderRadius: 2, borderColor: '#4090db', backgroundColor: '#4090db',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                        onPress={() => this.loginFB()}>
                        <Icon name='facebook-box' color='white' size={20} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 10 }}>Iniciar sesion con Facebook</Text>
                    </TouchableOpacity>
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Conectando"
                        message="Por favor, espere..."
                    />
                </View>
                <View style={{ height: height / 4 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#e0e0e0', width, marginTop: height / 4 - 35 }}>
                        <Text style={{ color: '#9e9e9e' }} >¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(resetAction)}>
                            <Text style={{ color: '#d1c4e9' }}>Registrate </Text>
                        </TouchableOpacity>

                    </View>
                </View>





            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
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
