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
} from 'react-native';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation'

export default class RegistroDetalle extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    constructor(){
        super()
        this.state = {
            usuario: '',
            photoUrl: '',
            password: '',
        }
    }
    componentWillMount(){
        const { state } = this.props.navigation;
        this.setState({usuario:state.params.user.split("@")[0],photoUrl:state.params.photoUrl})
    }
    render() {
        const { navigate,state } = this.props.navigation;

        const photo=state.params.photoUrl && state.params.photoUrl!="sin_imagen"?
                    <Image source={{uri:state.params.photoUrl}} style={{height:50,width:50}} resizeMode="contain"/>
                    :<Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />
        return (
            <View style={styles.container}>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <Text style={{ color: '#2c3e50', textAlign: 'center', fontSize: 20 }}>PUEDES SUBIR TU FOTO</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 20
                    }}
                    onPress={() => { Keyboard.dismiss(); navigate('main'); }}>
                    {photo}
                </TouchableOpacity>
                <View style={{ width: width - 50, paddingLeft: 5, marginBottom: 20 }}>
                    <Text style={{ color: '#2c3e50', textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>CREAR NOMBRE DE USUARIO</Text>
                    <Text style={{ color: '#2c3e50', textAlign: 'center', fontSize: 15 }}>Agrega un nombre de usuario.</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5,height:50,justifyContent:'center', borderColor: '#e0e0e0', backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10 }}>
                    <TextInput onChangeText={(text) => this.setState({ usuario: text })}
                        value={this.state.usuario}
                        placeholder="Usuario" placeholderTextColor="#9e9e9e" 
                        underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#e0e0e0', 
                backgroundColor: '#fafafa', width: width - 50, paddingLeft: 5, marginBottom: 10,
                justifyContent:'center',height:50 }}>
                    <TextInput onChangeText={(text) => this.setState({ password: text })}
                        placeholder="Contrasena" placeholderTextColor="#9e9e9e" secureTextEntry={true} underlineColorAndroid="transparent" selectionColor='#9575cd' />
                </View>
                {(this.state.usuario.length == 0 || this.state.password.length<8) &&
                        <View style={{
                            borderWidth: 1, borderRadius: 5, borderColor: '#d1c4e9',
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                        }}
                        >
                            <Text style={{ color: '#d1c4e9',fontWeight:'bold' }}>CONTINUAR</Text> 
                        </View>
                    }
                {this.state.usuario.length > 0 && this.state.password.length>7 &&
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        borderWidth: 1, borderRadius: 5, borderColor: '#9575cd', backgroundColor: '#9575cd',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10
                    }}
                    onPress={() => { Keyboard.dismiss(); 
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
                    }}>
                    <Text style={{ color: '#fff',fontWeight:'bold' }}>CONTINUAR</Text>
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
