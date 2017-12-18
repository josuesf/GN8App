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
    Alert,
    AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('window')
import { LoginManager, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { NavigationActions } from 'react-navigation'

export default class RegistroPrincipal extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    constructor() {
        super()
        this.state = {
            scanning: true,
            resultado: '',
            username: '',
            password: '',
            progressVisible: false,
        }
    }


    loginFB = () => {
        this.setState({ progressVisible: true })
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
                        const user_data={
                            id:res.id,
                            name:res.name,
                            first_name:res.first_name,
                            last_name:res.last_name,
                            email:res.email,
                            picture:res.picture.url,
                        }
                        AsyncStorage.setItem('USER_DATA', JSON.stringify(user_data), () => {
                            const main = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'main' })
                                ]
                            })
                            this.props.navigation.dispatch(main)
                        }).catch(err=>console.log('Error'));
                        
                    }

                });
                new GraphRequestManager().addRequest(infoRequest).start();

            }
        }, (error) => {

            this.setState({ progressVisible: false })
            Alert.alert('Error','Ocurrio un error, compruebe su conexion a internet')
        })
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="black" barStyle="light-content" />
                <View style={{ height: height / 3 }}>

                </View>
                <View style={{ height: height / 3, alignItems: 'center' }}>

                    <TouchableOpacity activeOpacity={0.8}
                        style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#3b5998', backgroundColor: '#3b5998',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                        onPress={this.loginFB}>
                        <Icon name='facebook-box' color='white' size={20} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 10 }}>Iniciar sesion con Facebook</Text>
                    </TouchableOpacity>
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Conectando"
                        message="Por favor, espere..."
                    />
                    <View style={{
                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 15,
                        borderTopWidth: 1, borderColor: '#e0e0e0', width: width - 50
                    }}>
                        <Text style={{ color: '#9e9e9e' }} >¿Deseas registrarte con tu correo? </Text>
                        <TouchableOpacity onPress={() => navigate('registro')}>
                            <Text style={{ color: '#d1c4e9' }}>Registrar </Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={{ height: height / 4 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#e0e0e0', width, marginTop: height / 4 - 35 }}>
                        <Text style={{ color: '#9e9e9e' }} >¿Ya tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => navigate('login')}>
                            <Text style={{ color: '#d1c4e9' }}>Iniciar </Text>
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
