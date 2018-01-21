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
import PerfilGuardados from '../SubScreens/PerfilGuardados'
import PerfilInvitaciones from '../SubScreens/PerfilInvitaciones'
import PerfilPosts from '../SubScreens/PerfilPosts'

const { width, height } = Dimensions.get('window')
export default class Perfil extends Component<{}> {
    static navigationOptions = {
        title: 'Perfil',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: Platform.OS == 'android' ? ({ tintColor, focused }) => (
            <Text style={{ fontSize: 10, color: focused ? tintColor : '#95a5a6' }}>
                PERFIL
            </Text>
        ) : "PERFIL",
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
                }
                )
            }
        })

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
    }
    
    render() {
        const { navigate } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: this.state.photoUrl }} style={{ borderRadius: 10, height: 100, width: 100 }} />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />

        const component1 = () => <Icon name="md-list" size={30} color="#95a5a6" />
        const component2 = () => <IconMaterial name="qrcode-scan" size={28} color="#95a5a6" />
        const component3 = () => <Icon name="md-bookmark" size={30} color="#95a5a6" />
        const buttons = this.state.es_empresa == "SI" ?
            [{ element: component1 }, { element: component2 }, { element: component3 }]
            : [{ element: component1 }, { element: component2 }, { element: component3 }]
        const { selectedIndex } = this.state
        return (
            <View style={styles.container} ref="perfil">


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
                                if (this.state.es_empresa == 'SI')
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
                {this.state.selectedIndex == 0 && <PerfilPosts navigation={this.props.navigation} />}
                {this.state.selectedIndex == 1 && <PerfilInvitaciones navigation={this.props.navigation} />}
                {this.state.selectedIndex == 2 && <PerfilGuardados navigation={this.props.navigation} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                paddingTop: 50,
            },
            android: {
                paddingTop: 30,
            }
        }),
    },
    avatar: {
        borderRadius: 10,
        width: 100,
        height: 100
    }
});
