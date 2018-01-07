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
    Alert,
    ActivityIndicator,
    AsyncStorage,
    Image,
    StatusBar,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import ListaPosts from '../components/ListaPosts'
import PostBox from '../components/PostBox'
import SocketIOClient from 'socket.io-client';
import store from '../store';
import { URL_WS_SOCKET } from '../Constantes';
import { Dialog } from 'react-native-simple-dialogs';
import QRCode from 'react-native-qrcode';
const { width, height } = Dimensions.get('window')

export default class Home extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon
                name={focused ? 'ios-home-outline' : 'ios-home-outline'}
                size={26}
                color={focused ? tintColor : '#d1c4e9'}
            />
        ),
    };
    constructor() {
        super()
        this.state = {
            posts: store.getState().posts,
            buscandoPosts: true,
            refreshing: false,
            page: 0,
            loading: false,
            SeguirCargando: true,
            modalCodigoQR: false,
        }

    }
    cargarDatosUsuarioStore = () => {
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                store.dispatch({
                    type: "SET_USER",
                    id: res.id,
                    correo: res.email,
                    nombre: res.name,
                    usuario: res.username,
                    password: res.password,
                    photoUrl: res.photo_url
                })
            }
        })
    }
    componentDidMount() {
        store.getState().socket.on('posts', (data, cb) => {
            this.setState({ posts: [data, ...this.state.posts] })
        });
    }
    CargarPosts = () => {
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: this.state.page
            })
        }
        fetch(URL_WS_SOCKET + "/ws/posts", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({
                        posts: this.state.page == 1 ?
                            responseJson.posts
                            : [...this.state.posts, ...responseJson.posts],
                        buscandoPosts: false,
                        loadingMore: false,
                        SeguirCargando: responseJson.posts.length != 0 ? true : false
                    })
                } else {
                    this.setState({ buscandoPosts: false, loadingMore: false })
                    Alert.alert("Error", responseJson.detail)
                }
            })
            .catch(err => {
                this.setState({ buscandoPosts: false, loadingMore: false })
                Alert.alert("Error", err)
            })
    }
    handleLoadMore = () => {
        if (this.state.SeguirCargando)
            this.setState(
                {
                    page: this.state.page + 1,
                },
                () => {
                    this.CargarPosts();
                }
            );

    };
    _onRefresh = () => {
        this.setState({ page: 1 }, () => { this.CargarPosts() })
    }
    componentWillMount() {
        this.cargarDatosUsuarioStore()

    }
    AbrirNuevoPost = () => {
        this.props.navigation.navigate('nuevoPost')
    }
    ObtenerCodigoQR = (post) => {
        this.setState({
            modalCodigoQR: true,
            modalCodQRdes: post.codigoqr_des,
            recuperandoCodigo: true,
            codigoRecuperado: null,
            currentPost: post,
        })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_post: post._id,
                id_usuario_invitado: store.getState().id,
            })
        }
        fetch(URL_WS_SOCKET + "/ws/getCodigo_Usuario", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    console.log(responseJson)
                    if (responseJson.invitacion.length > 0)
                        this.setState({
                            recuperandoCodigo: false,
                            codigoRecuperado: responseJson.invitacion[0]._id
                        })
                    else
                        this.setState({
                            recuperandoCodigo: false,
                        })
                } else {
                    this.setState({ recuperandoCodigo: false })
                    Alert.alert("Error", responseJson.detail)
                }
            })
            .catch(err => {
                this.setState({ recuperandoCodigo: false })
                Alert.alert("Error", err)
            })
    }
    GenerarCodigoQR = () => {
        this.setState({
            recuperandoCodigo: true,
        })
        const { currentPost } = this.state
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_post: currentPost._id,
                id_usuario_invitado: store.getState().id,
                nombre_post: currentPost.nombre_post,
                photo_post: currentPost.photo_post,
                codigoqr_des: currentPost.codigoqr_des,
                id_usuario: currentPost.id_usuario,
                nombre_usuario: currentPost.nombre_usuario,
                photo_url: currentPost.photo_url,
            })
        }
        fetch(URL_WS_SOCKET + "/ws/generarCodigoQR", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({ recuperandoCodigo: false, codigoRecuperado: responseJson.invitacion._id })
                } else {
                    this.setState({ recuperandoCodigo: false })
                    Alert.alert("Error", responseJson.detail)
                }
            })
            .catch(err => {
                this.setState({ recuperandoCodigo: false })
                Alert.alert("Error", err)
            })
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
                <Toolbar navigation={navigate} banner={"GN8"} />
                <TouchableOpacity onPress={this.AbrirNuevoPost}
                    activeOpacity={0.7} style={{ backgroundColor: '#FFF', height: 50, paddingRight: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 5, padding: 5 }}>
                        <Image source={{ uri: store.getState().photoUrl }}
                            style={{ width: 28, height: 28, }} />
                        <View style={{
                            borderWidth: 1, borderColor: '#831DA2',
                            backgroundColor: '#FFF',
                            padding: 5, borderRadius: 10, marginHorizontal: 10,
                            flex: 1,
                        }}>
                            <Text style={{ marginLeft: 5, color: '#831DA2' }}>
                                Quieres publicar tu evento?
                            </Text>
                        </View>
                        <Icon name="ios-images-outline" size={30} color="#831DA2" />

                    </View>
                </TouchableOpacity>
                {this.state.buscandoPosts && <ActivityIndicator color="#831DA2" size="large" style={{ marginTop: 10 }} />}

                <FlatList
                    data={this.state.posts}
                    renderItem={({ item }) => (
                        <PostBox post={item} navigate={navigate} ObtenerCodigoQR={() => this.ObtenerCodigoQR(item)} />

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
                    initialNumToRender={10}
                />
                <Dialog
                    visible={this.state.modalCodigoQR}
                    title="Codigo QR"
                //onTouchOutside={() => this.setState({ modalCodigoQR: false })} 
                >
                    <View>
                        <View>
                            <Text>{this.state.modalCodQRdes}</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginVertical: 10 }}>

                            {this.state.recuperandoCodigo &&
                                <ActivityIndicator size="large" color="#d1c4e9" />}
                            {this.state.codigoRecuperado &&
                                <View style={{ alignItems: 'center' }}><QRCode
                                    value={"47343734834843"}
                                    size={200}
                                    bgColor='#d1c4e9'
                                    fgColor='white' />
                                    <Text style={{ color: '#757575', marginVertical: 10 }}>Muestra por favor este codigo para canjearlo</Text>
                                    <TouchableOpacity onPress={() => this.setState({ modalCodigoQR: false })}
                                        activeOpacity={0.7}
                                        style={{ backgroundColor: "#831da2", borderRadius: 10, padding: 10, marginTop: 10, }}>
                                        <Text style={{ color: '#FFF' }}>Listo</Text>
                                    </TouchableOpacity>
                                </View>}
                        </View>
                        {!this.state.codigoRecuperado && !this.state.recuperandoCodigo &&
                            < View >
                                <TouchableOpacity onPress={this.GenerarCodigoQR}
                                    activeOpacity={0.7}
                                    style={{ backgroundColor: "#831da2", borderRadius: 10, padding: 10, marginTop: 10, }}>
                                    <Text style={{ color: '#FFF' }}>Aceptar invitacion</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7}
                                    onPress={() => this.setState({ modalCodigoQR: false })}
                                    style={{ backgroundColor: "#757575", borderRadius: 10, padding: 10, marginVertical: 5, }}>
                                    <Text style={{ color: '#FFF' }}>No,Gracias</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>
                </Dialog>

            </View>
        );
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(URL_WS_SOCKET + "/ws/posts", parametros)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ refreshing: false, posts: [] })
                if (responseJson.res == "ok") {
                    this.setState({ refreshing: false, posts: responseJson.posts })
                } else {
                    this.setState({ refreshing: false, posts: responseJson.posts })
                }
            })
            .catch(err => {
                this.setState({ refreshing: false })
                Alert.alert("Error", "Ocurrio un error al recuperar los posts")
            })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});
