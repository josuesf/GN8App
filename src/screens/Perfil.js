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
import Toolbar from '../components/toolbar'
import { NavigationActions } from 'react-navigation'
import { URL_WS, URL_WS_SOCKET } from '../Constantes'
import ImagePicker from 'react-native-image-picker';
import store from '../store'
import RNFetchBlob from 'react-native-fetch-blob'
import { ButtonGroup } from 'react-native-elements'
import PostBox from '../components/PostBox'
import QRCode from 'react-native-qrcode';

const { width, height } = Dimensions.get('window')
export default class Perfil extends Component<{}> {
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
            id: '',
            correo: '',
            nombre: '',
            usuario: '',
            photoUrl: store.getState().photoUrl,
            password: '',
            cargando: false,
            avatarSource: null,
            videoSource: null,
            dataImg: null,
            selectedIndex: 0,
            refreshing: false,
            loadingMore: false,
            SeguirCargando: false,
            page: 1,
            posts: [],
            SeguirCargando_qrs: false,
            page_qr: 1,
            invitaciones: [],
            refreshing_qrs: false
        }
    }

    componentWillMount() {
        //this.handleLoadMore()
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                console.log(res)
                this.setState({
                    id: res.id,
                    correo: res.email,
                    nombre: res.name,
                    usuario: res.username,
                    password: res.password,
                    photoUrl: res.photo_url,
                    es_empresa: res.es_empresa
                },
                    () => {
                        this.CargarPosts()

                    }
                )
            }
        })

    }
    componentDidMount() {

    }
    selectPhotoTapped() {
        const options = {
            title: 'Seleciona una imagen',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Toma una foto',
            chooseFromLibraryButtonTitle: 'Escoge una de tu galeria',
            quality: 1.0,
            maxWidth: 200,
            maxHeight: 200,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    avatarSource: source,
                    dataImg: response.data
                });
                this.storePicture()
            }
        });
    }
    storePicture = () => {
        this.setState({ cargando: true })
        const data = [
            { name: 'id', data: store.getState().id },
            { name: 'picture', filename: store.getState().id + Date.now() + ".png", data: this.state.dataImg }
        ]
        RNFetchBlob.fetch('POST', URL_WS_SOCKET + "/ws/upload_photo_user", {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, data)
            .then(res => {
                resultado = JSON.parse(res.data)
                console.log(resultado)
                if (resultado.res == "ok") {
                    const user = resultado.user
                    const user_data = {
                        id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        photo_url: user.photo_url,
                    }
                    AsyncStorage.setItem('USER_DATA', JSON.stringify(user_data), () => {
                        this.setState({ cargando: false, photoUrl: user_data.photo_url, avatarSource: null, })
                    }).catch(err => console.log('Error'));

                } else {
                    this.setState({ cargando: false })
                }
            })
            .catch(err => {
                this.setState({ cargando: false, avatarSource: null, })
                console.log(err)
            })



    }
    updateIndex = (selectedIndex) => {
        this.setState({ selectedIndex })
        if (selectedIndex == 0) this.CargarInvitaciones()
    }


    ObtenerCodigoQR = () => {

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
                page: this.state.page,
                id_usuario: this.state.id,
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
    render() {
        const { navigate } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: URL_WS_SOCKET + this.state.photoUrl }} style={{ borderRadius: 10, height: 100, width: 100 }} />
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
                <Toolbar navigation={navigate} banner={"P E R F I L"} />

                <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    paddingBottom: 10,
                }}>
                    {this.state.cargando &&
                        <ActivityIndicator style={{ marginTop: 20, alignSelf: 'center' }} size="large" color={"#9575cd"} />}

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                        {!this.state.cargando && <TouchableOpacity activeOpacity={0.8}
                            style={{
                                padding: 0, marginTop: 10,

                            }}
                            onPress={this.selectPhotoTapped.bind(this)}>
                            {this.state.avatarSource && <Image style={styles.avatar} source={this.state.avatarSource} />}
                            {!this.state.avatarSource && photo}

                        </TouchableOpacity>}
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 10 }}>

                        <Text style={{ color: '#333', fontWeight: '900', width: width / 2 }}>{store.getState().nombre}</Text>
                        <Text style={{ color: '#BDBDBD' }}>{store.getState().usuario}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if(this.state.es_empresa=='SI')
                                    navigate('editPerfilEmpresa')
                                else
                                    navigate('editPerfil')
                            }}
                            style={{ marginTop: 10 }}>
                            <Text style={{ color: '#9b59b6', fontWeight: 'bold' }}>Editar Perfil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => console.log('d')}>
                            <Icon name={"ios-star"}
                                size={30} color={"#FFC300"} style={{ marginRight: 15 }} />
                            <Text style={{ color: '#333', fontWeight: '900' }}>1</Text>
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
                {this.state.selectedIndex == 1 && this.state.es_empresa == "SI" && <FlatList
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
                />}
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
        borderRadius: 10,
        width: 100,
        height: 100
    }
});
