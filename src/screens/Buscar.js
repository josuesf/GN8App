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
    Linking,
    Dimensions,
    Vibration,
    Button,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import ListaEmpresas from '../components/ListaEmpresas'
import {SearchBar } from "react-native-elements";
import {URL_WS} from '../Constantes'
const { width, height } = Dimensions.get('window')
export default class Buscar extends Component<{}> {
    constructor() {
        super()
        this.state = {
            buscarBox: false,
            textBusqueda: '',
            empresas: [],
        }
    }
    componentWillMount(){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(URL_WS+"/ws/listaEmpresas",parametros)
        .then(response=>response.json())
        .then(responseJson=>{
            if(responseJson.res=="ok"){
                this.setState({empresas:responseJson.empresas})
            }
        })
        .catch(err=>{
            Alert.alert("Error","Ocurrio un error al recuperar empresas")
        })
    }
    static navigationOptions = {
        title: 'Buscar',
        headerTintColor: 'purple',
        header: null,
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon
                name={focused ? 'ios-search-outline' : 'ios-search-outline'}
                size={25}
                color={focused ? tintColor : '#d1c4e9'}
            />
        ),

    };
    onBusqueda = (text) => {
        this.setState({ textBusqueda: text })
    }
    render() {
        const { navigate } = this.props.navigation;
        const toolbar = !this.state.buscarBox
            ? <View style={{
                backgroundColor: '#fcfcfc', elevation: 1.5, height: 50,
                ...Platform.select({
                    ios: {
                        borderBottomWidth: 0.5, marginTop: 10, borderColor: '#bdc3c7',
                    },
                }),
            }} >
                <TouchableOpacity onPress={() => this.setState({ buscarBox: true })}
                    activeOpacity={0.8} style={{ margin: 10, alignItems: 'center', flexDirection: 'row' }}>
                    <IconMaterial name={'magnify'} size={30} color={'#616161'} />
                    <Text style={{ fontSize: 16, color: '#9e9e9e' }}>Buscar discotecas, bares y mas</Text>
                </TouchableOpacity>
            </View>
            : <View style={{ 
                ...Platform.select({
                    ios: {
                        borderBottomWidth: 0.5, marginTop: 10, borderColor: '#bdc3c7',
                    },
                }),backgroundColor: '#fcfcfc', elevation: 1.5, alignItems: 'center', height: 50, flexDirection: 'row' }} >
                <TouchableOpacity onPress={() => this.setState({ buscarBox: false })}
                    style={{ margin: 10, alignItems: 'center' }}>
                    <IconMaterial name={'arrow-left'} size={30} color={'#616161'} />
                </TouchableOpacity>
                <TextInput value={this.state.textBusqueda} onChangeText={(text) => this.onBusqueda(text)}
                    placeholder="Buscar" placeholderTextColor="#9e9e9e" style={{ width: width - 100, fontSize: 18 }} autoFocus={true} underlineColorAndroid={'transparent'} selectionColor="#616161" />
                {this.state.textBusqueda.length > 0 &&
                    <TouchableOpacity onPress={() => this.setState({ textBusqueda: '' })}
                        style={{ margin: 10, alignItems: 'center' }}>
                        <IconMaterial name={'close'} size={25} color={'#616161'} />
                    </TouchableOpacity>}

            </View>

        return (
            <View style={styles.container}>
                <SearchBar
                    round
                    containerStyle={{ ...Platform.select({
                        ios: {
                           marginTop: 20,
                        },
                    }),backgroundColor:'#FFF'}}
                    inputStyle={{backgroundColor:'#eee'}}
                    lightTheme
                    onChangeText={(text)=>console.log(text)}
                    onClearText={(text)=>console.log(text)}
                    placeholder='Buscar...' />
                <ListaEmpresas empresas={this.state.empresas} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

});
