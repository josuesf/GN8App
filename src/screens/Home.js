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
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFondation from 'react-native-vector-icons/Foundation'
import Toolbar from '../components/toolbar'
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
            <IconFondation
                name={focused ? 'home' : 'home'}
                size={30}
                color={focused ? tintColor : '#95a5a6'}
            />
        ),
    };
    constructor() {
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        super()
        this.state = {
            posts: store.getState().posts,
            //buscandoPosts: true,
            refreshing: false,
            page: 1,
            loading: false,
            SeguirCargando: false,
            modalCodigoQR: false,
            categoriaSel:0,
        }

    }
    cargarDatosUsuarioStore = () => {
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                console.log(res)
                store.dispatch({
                    type: "SET_USER",
                    id: res.id,
                    correo: res.email,
                    nombre: res.name,
                    usuario: res.username,
                    password: res.password,
                    photoUrl: res.photo_url,
                    es_empresa:res.es_empresa,
                })
            }
        })
    }
    componentDidMount() {
        store.getState().socket.on('posts', (data, cb) => {
            const currentPosts = this.state.posts
            this.setState({ posts: [] }, () => this.setState({ posts: [data, ...currentPosts] }))
        });
    }
    CargarPosts = () => {
        this.setState({ loadingMore: true })
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
                    console.log(this.state.page)
                    if (this.state.page == 1) {
                        AsyncStorage.setItem('POSTS', JSON.stringify(responseJson.posts), () => {
                            console.log('Se guardaron las publicaciones')
                        }).catch(err => console.log(err));
                        this.setState({
                            posts: [],
                        }, () => this.setState({
                            posts: [...responseJson.posts],
                            buscandoPosts: false,
                            loadingMore: false,
                            SeguirCargando: responseJson.posts.length != 0 ? true : false
                        }))
                    } else {
                        this.setState({
                            posts: [...this.state.posts, ...responseJson.posts],
                            buscandoPosts: false,
                            loadingMore: false,
                            SeguirCargando: responseJson.posts.length != 0 ? true : false
                        })
                    }

                } else {
                    this.setState({ buscandoPosts: false, loadingMore: false })

                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ buscandoPosts: false, loadingMore: false, SeguirCargando: false })
            })
    }
    handleLoadMore = () => {
        if (this.state.SeguirCargando)
            this.setState(
                {
                    page: this.state.page + 1,
                    SeguirCargando: false,
                },
                () => {
                    this.CargarPosts();
                }
            );

    };
    _onRefresh = () => {
        this.setState({ page: 1 }, () => this.CargarPosts())
    }
    componentWillMount() {
        this.cargarDatosUsuarioStore()
        AsyncStorage.getItem("POSTS", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                this.setState({ posts: res })
            }
        })
        this.CargarPosts()
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
                    if (responseJson.invitacion.length > 0) {
                        this.setState({
                            recuperandoCodigo: false,
                            codigoRecuperado: responseJson.invitacion[0]._id
                        })
                    } else
                        this.setState({
                            recuperandoCodigo: false,
                        })
                } else {
                    this.setState({ recuperandoCodigo: false })
                }
            })
            .catch(err => {
                this.setState({ recuperandoCodigo: false })
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
                }
            })
            .catch(err => {
                this.setState({ recuperandoCodigo: false })
            })
    }
    VerInvitacion = () => {
        store.dispatch({
            type: 'ACTUALIZAR_INVITACIONES',
            nueva_invitacion: true,
        })
        this.props.navigation.navigate('invitaciones')
    }
    SeleccionarCategoria=(index)=>{
        this.setState({categoriaSel:index})
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
                {store.getState().es_empresa=="SI" && <TouchableOpacity onPress={this.AbrirNuevoPost}
                    activeOpacity={0.7} style={{ backgroundColor: '#FFF', height: 50, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 5, padding: 5 }}>
                        {/*<Image source={{ uri: store.getState().photoUrl }}
                            style={{ width: 28, height: 28, }} />*/}
                        <Image source={require('../assets/img/imgloader.gif')}
                            style={{ height: 35, width: 35 }}
                            resizeMode='contain' />
                        <View style={{
                            borderWidth: 1.5, borderColor: '#95a5a6',
                            backgroundColor: '#FFF',
                            padding: 5, borderRadius: 10, marginHorizontal: 10,
                            flex: 1,
                        }}>
                            <Text style={{ marginLeft: 5, alignSelf: 'center', fontWeight: 'bold', color: '#95a5a6' }}>
                                Quieres publicar tu evento?
                            </Text>
                        </View>
                        <Image source={require('../assets/img/imgloader.gif')}
                            style={{ height: 35, width: 35 }}
                            resizeMode='contain' />

                    </View>
                </TouchableOpacity>}
                <View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <TouchableOpacity onPress={()=>this.SeleccionarCategoria(0)} style={{
                        backgroundColor: '#95a5a6',alignItems:'center',
                        marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10,paddingVertical:5, borderRadius: 10, justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FFF', fontWeight: '900' }}>Todo</Text>
                        {this.state.categoriaSel==0 && <IconMaterial name="circle" size={10} color="#FFF"/>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.SeleccionarCategoria(1)} style={{
                        backgroundColor: '#9b59b6',alignItems:'center',
                        marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10,paddingVertical:5, borderRadius: 10, justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FFF', fontWeight: '900' }}>Comida</Text>
                        {this.state.categoriaSel==1 && <IconMaterial name="circle" size={10} color="#FFF"/>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.SeleccionarCategoria(2)} style={{
                        backgroundColor: '#95a5a6',alignItems:'center',
                        marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10,paddingVertical:5, borderRadius: 10, justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FFF', fontWeight: '900' }}>Bebidas</Text>
                        {this.state.categoriaSel==2 && <IconMaterial name="circle" size={10} color="#FFF"/>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.SeleccionarCategoria(3)} style={{
                        backgroundColor: '#9b59b6',alignItems:'center',
                        marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10,paddingVertical:5, borderRadius: 10, justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FFF', fontWeight: '900' }}>Discotecas</Text>
                        {this.state.categoriaSel==3 && <IconMaterial name="circle" size={10} color="#FFF"/>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.SeleccionarCategoria(4)} style={{
                        backgroundColor: '#95a5a6',alignItems:'center',
                        marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10,paddingVertical:5, borderRadius: 10, justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FFF', fontWeight: '900' }}>Bares</Text>
                        {this.state.categoriaSel==4 && <IconMaterial name="circle" size={10} color="#FFF"/>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.SeleccionarCategoria(5)}style={{
                        backgroundColor: '#9b59b6',alignItems:'center',
                        marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10,paddingVertical:5, borderRadius: 10, justifyContent: 'center'
                    }}>
                        <Text style={{ color: '#FFF', fontWeight: '900' }}>Ropas</Text>
                        {this.state.categoriaSel==5 && <IconMaterial name="circle" size={10} color="#FFF"/>}
                    </TouchableOpacity>
                </ScrollView>
                </View>
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
                            : <Image source={require('../assets/img/loading.gif')} style={{ marginVertical: 10, height: 50, width: 50, alignSelf: 'center' }} />
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={10}
                    initialNumToRender={10}
                />
                <Dialog
                    visible={this.state.modalCodigoQR}
                    title={this.state.modalCodQRdes}
                    onTouchOutside={() => this.setState({ modalCodigoQR: false })}
                    onRequestClose={() => this.setState({ modalCodigoQR: false })}
                >
                    <View>
                        <View style={{ alignItems: 'center', marginVertical: 10 }}>

                            {this.state.recuperandoCodigo &&
                                <ActivityIndicator size="large" color="#d1c4e9" />}
                            {this.state.codigoRecuperado &&
                                <View style={{ alignItems: 'center' }}><QRCode
                                    value={this.state.codigoRecuperado}
                                    size={200}
                                    bgColor='#333'
                                    fgColor='white' />
                                    <Text style={{ color: '#757575', marginVertical: 10 }}>Muestra por favor este codigo para canjearlo</Text>
                                    <TouchableOpacity onPress={() => this.setState({ modalCodigoQR: false }, () => this.VerInvitacion())}
                                        activeOpacity={0.7}
                                        style={{ backgroundColor: "#831da2", borderRadius: 10, padding: 10, marginTop: 10, }}>
                                        <Text style={{ color: '#FFF' }}>Listo</Text>
                                    </TouchableOpacity>
                                </View>}
                        </View>
                        {!this.state.codigoRecuperado && !this.state.recuperandoCodigo &&
                            < View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.GenerarCodigoQR}
                                    activeOpacity={0.7}
                                    style={{
                                        backgroundColor: "#831da2", flexDirection: 'row',
                                        alignItems: 'center',
                                        borderRadius: 10, padding: 10, marginTop: 10,
                                    }}>
                                    <Icon name='ios-barcode-outline' size={25} color="white" />
                                    <Text style={{ color: '#FFF', marginHorizontal: 10 }}>OBTENER CODIGO</Text>
                                </TouchableOpacity>
                            </View>}
                    </View>
                </Dialog>

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
