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
    Image,Keyboard,
} from 'react-native';
const { width, height } = Dimensions.get('window')
export default class Login extends Component<{}> {
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
                <View style={{ height: height / 3 }}>
                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                        <TextInput onChangeText={(text) => this.setState({ username: text })}
                            placeholder="Usuario" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                    </View>
                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                        <TextInput onChangeText={(text) => this.setState({ password: text })}
                           secureTextEntry={true} placeholder="Contraseña" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                    </View>
                    {(this.state.username.length == 0 || this.state.password.length == 0) &&
                        <View style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#d1c4e9',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}>
                            <Text style={{ color: '#d1c4e9',fontWeight:'bold' }}>INICIAR SESION</Text>
                        </View>
                    }
                    {this.state.username.length > 0 && this.state.password.length > 0 &&
                        <TouchableOpacity activeOpacity={0.8}
                            style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#9575cd', backgroundColor: '#9575cd',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}
                        onPress={() => {Keyboard.dismiss();navigate('main');}}>
                            <Text style={{ color: '#fff',fontWeight:'bold' }}>INICIAR SESION</Text>
                        </TouchableOpacity>}
                </View>
                <View style={{ height: height / 4 }}>
                    <View style={{ alignItems: 'center',justifyContent:'center',flexDirection:'row',padding:15, borderTopWidth: 1, borderColor: '#e0e0e0',width,marginTop:height/4-35 }}>
                        <Text style={{ color: '#9e9e9e' }} >¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigate('codigoQR')}>
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
