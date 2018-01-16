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
    AsyncStorage,
    Image,
    Alert,
    ActivityIndicator,
    ScrollView,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFondation from 'react-native-vector-icons/Foundation'
import { URL_WS_SOCKET } from '../Constantes'
import ImagePicker from 'react-native-image-picker';
import store from '../store'
import RNFetchBlob from 'react-native-fetch-blob'
import { ButtonGroup } from 'react-native-elements'
import PostBox from '../components/PostBox'
import QRCode from 'react-native-qrcode';
import { Dialog } from 'react-native-simple-dialogs';

const { width, height } = Dimensions.get('window')
export default class VistaPerfil extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconFondation
                name={focused ? 'torso' : 'torso'}
                size={30}
                color={focused ? tintColor : '#95a5a6'}
            />
        ),
    };
    constructor() {
        super()
        this.state = {
            id: store.getState().id,


            cargando: false,
            avatarSource: null,

            dataImg: null,
            selectedIndex: 1,
            refreshing: false,
            loadingMore: false,
            SeguirCargando: false,
            page: 1,
            posts: [],
            SeguirCargando_qrs: false,
            page_qr: 1,
            invitaciones: [],
            refreshing_qrs: false,

            modalCodigoQR: false,
        }
    }

    componentWillMount() {
        this.BuscarUsuario()
        this.CargarPosts()
    }


    updateIndex = (selectedIndex) => {
        this.setState({ selectedIndex })
        //if (selectedIndex == 0) this.CargarInvitaciones()
    }

    CargarPosts = () => {
        const { params } = this.props.navigation.state;
        this.setState({ loadingMore: true })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: this.state.page,
                id_usuario: params.id_usuario,
            })
        }
        fetch(URL_WS_SOCKET + "/ws/posts_user", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({
                        posts: this.state.page == 1 ?
                            responseJson.posts
                            : [...this.state.posts, ...responseJson.posts],
                        loadingMore: false,
                        SeguirCargando: responseJson.posts.length != 0 ? true : false
                    })
                } else {
                    this.setState({ loadingMore: false })
                }
            })
            .catch(err => {
                this.setState({ loadingMore: false })
                //Agregar un indicador de falta de conexio
            })
    }
    BuscarUsuario = () => {
        const { params } = this.props.navigation.state;
        const parametros = {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: params.id_usuario,
            })
        }
        fetch(URL_WS_SOCKET + "/ws/recuperar_usuario", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    console.log(responseJson)
                    this.setState({
                        id_usuario: responseJson.user._id,
                        correo: responseJson.user.email,
                        nombre: responseJson.user.name,
                        usuario: responseJson.user.username,
                        photoUrl: responseJson.user.photo_url,
                        likes: responseJson.user.likes,
                        es_empresa:responseJson.user.es_empresa
                    })
                }
            })
            .catch(err => {
                this.setState({ loading: false })
                //Agregar un indicador de falta de conexion
            })
    }
    handleLoadMore = () => {
        if (this.state.SeguirCargando)
            this.setState(
                {
                    page: this.state.page + 1
                    , SeguirCargando: false
                },
                () => {
                    this.CargarPosts();
                }
            );

    };
    _onRefresh = () => {
        this.setState({ page: 1 }, () => this.CargarPosts())
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
    render() {
        const { navigate, goBack } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: this.state.photoUrl }} style={styles.avatar} />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />

        const component1 = () => <IconMaterial name="qrcode-scan" size={28} color="#95a5a6" />
        const component2 = () => <Icon name="md-list" size={30} color="#95a5a6" />
        const component3 = () => <Icon name="md-bookmark" size={30} color="#95a5a6" />
        const buttons = this.state.es_empresa == "SI" ?
            [{ element: component1 }, { element: component2 }, { element: component3 }]
            : [{ element: component1 }, { element: component3 }]
        const { selectedIndex } = this.state
        return (
            <View style={styles.container} ref="perfil">
                <View style={[styles.toolbar]} >
                    <TouchableOpacity onPress={() => goBack()}>
                        <IconFondation name="x" size={30} color="#95a5a6" style={{ marginHorizontal: 20, marginVertical: 10 }} />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    paddingBottom: 10,
                }}>
                    {this.state.cargando &&
                        <ActivityIndicator style={{ marginTop: 20, alignSelf: 'center' }} size="large" color={"#9575cd"} />}

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ padding: 0, marginTop: 10 }}>
                            {photo}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 10 }}>

                        <Text style={{ color: '#333', fontWeight: '900', width: width / 2 }}>{this.state.nombre}</Text>
                        <Text style={{ color: '#BDBDBD' }}>{this.state.usuario}</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => console.log('d')}>
                            <Icon name={"ios-star"}
                                size={30} color={"#FFC300"} style={{ marginRight: 15 }} />
                            <Text style={{ color: '#333', fontWeight: '900' }}>{this.state.likes}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ flexDirection: 'column', }}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{ height: 40 }} />
                </View>
                {this.state.selectedIndex == 1 && this.state.es_empresa == "SI" &&
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

                }
                {this.state.selectedIndex == 0 &&
                    <View><FlatList
                        numColumns={3}
                        data={this.state.invitaciones}
                        renderItem={({ item }) => (
                            /*<InvitacionBox invitacion={item} navigate={navigate} 
                            VerCodigoQR={() => this.VerCodigoQR(item)} />*/
                            <View style={{ padding: 10 }}>
                                <QRCode
                                    value={item._id}
                                    size={width / 3 - 20}
                                    bgColor='#d1c4e9'
                                    fgColor='white' />
                            </View>
                        )}
                        refreshing={this.state.refreshing_qrs}
                        onRefresh={this._onRefresh_qrs}
                        keyExtractor={(item, index) => index}
                        ListFooterComponent={() =>
                            !this.state.loadingMore_qrs ?
                                (this.state.SeguirCargando_qrs ? null :
                                    null)//<Text style={{ alignSelf: 'center', marginVertical: 5, color: '#757575' }}>No hay mas comentarios</Text>)
                                : <ActivityIndicator style={{ marginVertical: 10 }} size="large" color={"#831DA2"} />
                        }
                        onEndReached={this.handleLoadMore_qrs}
                        onEndReachedThreshold={10}
                        initialNumToRender={10}
                    />
                        {(this.state.invitaciones.length == 0) && <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Icon name="ios-sad-outline" size={50} color="#831da2" />
                            <TouchableOpacity onPress={() => navigate('home')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 1, borderColor: '#831da2', padding: 10
                                }}>

                                <Text style={{ color: '#831da2' }}>OBTENER CODIGOS</Text>
                            </TouchableOpacity>

                        </View>}
                    </View>
                }
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
                                <View style={{ alignItems: 'center' }}>
                                    <QRCode
                                        value={this.state.codigoRecuperado}
                                        size={200}
                                        bgColor='#333'
                                        fgColor='white' />
                                    <Text style={{ color: '#757575', marginVertical: 10 }}>Muestra por favor este codigo para canjearlo</Text>

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

    CargarInvitaciones = () => {
        this.setState({ loadingMore_qrs: true })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page: this.state.page_qr,
                id_usuario_invitado: this.state.id
            })
        }
        fetch(URL_WS_SOCKET + "/ws/invitaciones_user_check", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({
                        invitaciones: this.state.page_qr == 1 ?
                            responseJson.invitaciones
                            : [...this.state.invitaciones, ...responseJson.invitaciones],
                        loadingMore_qrs: false,
                        SeguirCargando_qrs: responseJson.invitaciones.length != 0 ? true : false
                    })

                } else {
                    this.setState({ loadingMore_qrs: false })
                }
            })
            .catch(err => {
                this.setState({ loadingMore_qrs: false })
                //Agregar un indicador de falta de conexio
            })
    }
    handleLoadMore_qrs = () => {
        if (this.state.SeguirCargando_qrs)
            this.setState(
                {
                    page_qr: this.state.page_qr + 1
                    , SeguirCargando_qrs: false
                },
                () => {
                    this.CargarInvitaciones();
                }
            );

    };
    _onRefresh_qrs = () => {
        this.setState({ page_qr: 1 }, () => { this.CargarInvitaciones() })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    avatar: {
        backgroundColor: '#f1eff0',
        borderRadius: 10,
        width: 100,
        height: 100
    },
    toolbar: {
        width, backgroundColor: '#fcfcfc',
        flexDirection: 'row',
        height: 50,
        ...Platform.select({
            ios: {
                marginTop: 20,
            },
        }),
    },
});
