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
} from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/Ionicons';

export default class RegistroDetalle extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    state = {
        usuario: '',
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <Text style={{ color: '#2c3e50', fontFamily: 'Billabong', textAlign: 'center', fontSize: 20 }}>TOMA UNA FOTO</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 20
                    }}
                    onPress={() => { Keyboard.dismiss(); navigate('main'); }}>
                    <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 20 }}>
                    <Text style={{ color: '#2c3e50', fontFamily: 'Billabong', textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>CREAR NOMBRE DE USUARIO</Text>
                    <Text style={{ color: '#2c3e50', fontFamily: 'Billabong', textAlign: 'center', fontSize: 15 }}>Agrega un nombre de usuario. Puedes cambiarlo en cualquier momento</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <TextInput onChangeText={(text) => this.setState({ usuario: text })}
                        placeholder="Usuario" placeholderTextColor="#9e9e9e" underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                {(this.state.usuario.length == 0) &&
                        <View style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#3498db',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}
                        >
                            <Text style={{ color: '#3498db' }}>Continuar</Text> 
                        </View>
                    }
                {this.state.usuario.length > 0 &&
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        borderWidth: 1, borderRadius: 5, borderColor: '#3498db', backgroundColor: '#3498db',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                    }}
                    onPress={() => { Keyboard.dismiss(); navigate('main'); }}>
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
