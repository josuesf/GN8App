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
} from 'react-native';
const { width, height } = Dimensions.get('window')
export default class Registro extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    state = {
        correo: '',
        nombre: '',
        password: '',
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 30 }}>
                    <Text style={{ color: '#2c3e50', fontFamily: 'Billabong', textAlign: 'center', fontSize: 30 }}>Welcome</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <TextInput onChangeText={(text) => this.setState({ correo: text })}
                        placeholder="Correo" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <TextInput onChangeText={(text) => this.setState({ nombre: text })}
                        placeholder="Nombre y Apellido" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <TextInput onChangeText={(text) => this.setState({ password: text })}
                        placeholder="Contraseña" placeholderTextColor="#9e9e9e" secureTextEntry={true} underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                {(this.state.correo.length == 0 || this.state.nombre.length == 0|| this.state.password.length == 0) &&
                        <View style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#3498db',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}
                        > 
                            <Text style={{ color: '#3498db' }}>Continuar</Text>
                        </View>
                    }
                {this.state.correo.length > 0 && this.state.nombre.length > 0 && this.state.password.length > 0 &&
                    <TouchableOpacity activeOpacity={0.8}
                        style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#3498db', backgroundColor: '#3498db',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}
                        onPress={() => { Keyboard.dismiss(); navigate('registrodetalle'); }}>
                        <Text style={{ color: '#fff' }}>Continuar</Text>
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
