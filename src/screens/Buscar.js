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
    FlatList,
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFondation from 'react-native-vector-icons/Foundation'
import Toolbar from '../components/toolbar'
import { SearchBar } from "react-native-elements";
import EmpresaBox from '../components/EmpresaBox'
import { URL_WS, URL_WS_SOCKET } from '../Constantes'
const { width, height } = Dimensions.get('window')
export default class Buscar extends Component<{}> {
    constructor() {
        super()
        this.state = {
            textBusqueda: '',
            empresas: [],
            page: 1,
            refreshing: false,
            SeguirCargando: false
        }
    }
    componentWillMount() {
        AsyncStorage.getItem("EMPRESAS", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                this.setState({ empresas: res })
            }
        })
        this.CargarEmpresas()
    }
    static navigationOptions = {
        title: 'Buscar',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: Platform.OS=='android'?({ tintColor, focused }) => (
            <Text style={{fontSize:10,color:focused ? tintColor : '#95a5a6'}}>
                EXPLORAR
            </Text>
        ):"EXPLORAR",
        tabBarIcon: ({ tintColor, focused }) => (
            <IconFondation
                name={focused ? 'magnifying-glass' : 'magnifying-glass'}
                size={30}
                color={focused ? tintColor : '#95a5a6'}
            />
        ),

    };
    CargarEmpresas = () => {
        this.setState({ loadingMore: true })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: this.state.page,
                es_empresa: 'SI'
            })
        }
        fetch(URL_WS_SOCKET + "/ws/listaEmpresas", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    if (this.state.page == 1) {
                        console.log("Empresas", this.state.page)
                        AsyncStorage.setItem('EMPRESAS', JSON.stringify(responseJson.empresas), () => {
                            console.log('Se guardaron las publicaciones')
                        }).catch(err => console.log(err));
                        this.setState({
                            empresas: [],
                        }, () => this.setState({
                            empresas: [...responseJson.empresas],
                            loadingMore: false,
                            SeguirCargando: responseJson.empresas.length != 0 ? true : false
                        }))
                    } else {
                        this.setState({
                            empresas: [...this.state.empresas, ...responseJson.empresas],
                            loadingMore: false,
                            SeguirCargando: responseJson.empresas.length != 0 ? true : false
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    BuscarUsuarios = (text) => {
        this.setState({ loadingMore: true, textBusqueda: text })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: text
            })
        }
        fetch(URL_WS_SOCKET + "/ws/buscarUsuarios", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({
                        empresas: [],
                    }, () => this.setState({
                        empresas: [...responseJson.empresas],
                        loadingMore: false,
                    }))
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleLoadMore = () => {
        if (this.state.SeguirCargando)
            this.setState(
                {
                    page: this.state.page + 1,
                    SeguirCargando: false
                },
                () => {
                    this.CargarEmpresas();
                }
            );

    };
    _onRefresh = () => {
        this.setState({ page: 1, }, () => { this.CargarEmpresas() })
    }
    onBusqueda = (text) => {
        this.setState({ textBusqueda: text })
    }
    VerPerfil = (id) => {
        //if (store.getState().id != id)
            this.props.navigation.navigate('vistaPerfil', { id_usuario: id })
    }
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <SearchBar

                    animateTransitions={true}
                    animationType="spring"
                    containerStyle={{
                        ...Platform.select({
                            ios: {
                                marginTop: 0,
                            },
                        }), backgroundColor: '#FFF'
                    }}
                    inputStyle={{ backgroundColor: '#eee' }}
                    lightTheme
                    onChangeText={(text) => this.BuscarUsuarios(text)}
                    onClearText={(text) => console.log(text)}
                    placeholder='Buscar lugares personas ...' />

                <FlatList
                    data={this.state.empresas}

                    renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => this.VerPerfil(item._id)}>
                            <EmpresaBox empresa={item} style={styles.item} />
                        </TouchableOpacity>
                    )}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={() =>
                        !this.state.loadingMore ?
                            (this.state.SeguirCargando ? null :
                                null)//<Text style={{ alignSelf: 'center', marginVertical: 5, color: '#757575' }}>No hay mas comentarios</Text>)
                            : <ActivityIndicator style={{ marginVertical: 10 }} size="large" color={"#831DA2"} />
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.1}
                    initialNumToRender={8}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        ...Platform.select({
            ios:{
                paddingTop:20,
            },
            android:{
                marginTop:0,
            }
        }),
        
    },

});
