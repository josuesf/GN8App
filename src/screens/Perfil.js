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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import { NavigationActions } from 'react-navigation'
import { URL_WS } from '../Constantes'
import ImagePicker from 'react-native-image-picker';
import store from '../store'
import RNFetchBlob from 'react-native-fetch-blob'

import {
    LoginManager,
} from 'react-native-fbsdk'
const { width, height } = Dimensions.get('window')
export default class Perfil extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'account-outline' : 'account-outline'}
                size={25}
                color={focused ? tintColor : '#d1c4e9'}
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
            photoUrl: '',
            password: '',
            cargando: false,
            avatarSource: null,
            videoSource: null,
            dataImg: null,
        }
    }
    recuperarDatosUsuario=()=>{
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                if(this.refs.perfil)
                this.setState({
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
    componentWillMount() {
        this.recuperarDatosUsuario()
    }
    componentDidMount(){
        store.subscribe(this.recuperarDatosUsuario)
    }
    cerrarSesion = () => {
        AsyncStorage.removeItem("USER_DATA", err => {
            if (!err) {
                const registerMain = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'registroMain' })
                    ]
                })
                this.props.navigation.dispatch(registerMain)
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
            maxWidth: 500,
            maxHeight: 500,
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

    selectVideoTapped() {
        const options = {
            title: 'Video Picker',
            takePhotoButtonTitle: 'Take Video...',
            mediaType: 'video',
            videoQuality: 'medium'
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    videoSource: response.uri
                });
            }
        });
    }
    storePicture = () => {
        this.setState({ cargando: true })
        const data = [
            { name: 'id', data: this.state.id },
            { name: 'picture', filename: 'avatar.png', data: this.state.dataImg }
        ]
        RNFetchBlob.fetch('POST', URL_WS + "/ws/upload_photo_user", {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, data)
            .then(res => {
                resultado = JSON.parse(res.data)
                console.log(resultado)
                if (resultado.res == "ok") {
                    const user = resultado.user[0]
                    const user_data = {
                        id: user.id,
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
                    Alert.alert("Error", "No se pudo subir su imagen vuelva a intentarlo")
                }
            })
            .catch(err => {
                this.setState({ cargando: false, avatarSource: null, })
                console.log(err)
                Alert.alert("Error", "No se pudo subir su imagen vuelva a intentarlo, compruebe su conexion a internet")
            })



    }
    render() {
        const { navigate } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: this.state.photoUrl }} style={{ borderRadius: 50, height: 100, width: 100 }} />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />

        return (
            <View style={styles.container} ref="perfil">
                <Toolbar navigation={navigate} banner={"Perfil"} />
                <ScrollView>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, paddingBottom: 10,
                        backgroundColor: '#fafafa', borderColor: '#e0e0e0'
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
                        <View style={{ flexDirection: 'column',marginLeft:20, marginBottom: 10 }}>
                            <Text style={{ color: '#333', fontWeight: '900', width:width/2}}>{this.state.nombre}</Text>
                            <Text style={{ color: '#BDBDBD' }}>{this.state.usuario}</Text>
                            <TouchableOpacity 
                                onPress={()=>navigate('editPerfil')}
                                style={{ marginTop: 10 }}>
                                <Text style={{ color: '#9b59b6', fontWeight: 'bold' }}>Editar Perfil</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', width, }}>

                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    avatar: {
        borderRadius: 50,
        width: 100,
        height: 100
    }
});
