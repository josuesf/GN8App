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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width, height } = Dimensions.get('window')
export default class RegistroPrincipal extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    state = {
        scanning: true,
        resultado: '',
        username: '',
        password: '',
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="black" barStyle="light-content" />
                <View style={{ height: height / 3 }}>

                </View>
                <View style={{ height: height / 3,alignItems:'center' }}>
                   
                    <TouchableOpacity activeOpacity={0.8}
                        style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#3b5998', backgroundColor: '#3b5998',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10,flexDirection:'row',
                            alignItems:'center',justifyContent:'center'
                        }}
                        onPress={() => { Keyboard.dismiss(); navigate('main'); }}>
                        <Icon name='facebook-box' color='white' size={20} />
                        <Text style={{ color: '#fff', fontWeight: 'bold',marginLeft:10 }}>Iniciar sesion con Facebook</Text>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 15, 
                        borderTopWidth: 1, borderColor: '#e0e0e0', width:width-50 }}>
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