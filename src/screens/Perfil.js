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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import { NavigationActions } from 'react-navigation'
import { URL_WS } from '../Constantes'
import ImagePicker from 'react-native-image-picker';

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
    componentWillMount() {
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
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
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);


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
        this.setState({cargando:true})
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
                resultado=JSON.parse(res.data)
                console.log(resultado)
                if(resultado.res=="ok"){
                    const user=resultado.user[0]
                    const user_data = {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        photo_url: user.photo_url,
                    }
                    AsyncStorage.setItem('USER_DATA', JSON.stringify(user_data), () => {
                        this.setState({cargando:false})
                    }).catch(err => console.log('Error'));
                }else{
                    this.setState({cargando:false})
                    Alert.alert("Error","No se pudo subir su imagen vuelva a intentarlo")
                }
            })
            .catch(err => console.log(err))

        

    }
    render() {
        const { navigate } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: this.state.photoUrl }} style={{ borderRadius: 75, height: 150, width: 150 }}  />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />

        return (
            <View style={styles.container}>
                <Toolbar navigation={navigate} banner={this.state.nombre} />
                <View style={styles.container}>
                    {this.state.cargando && 
                        <ActivityIndicator style={{marginTop:20}} size="large" color={"#9575cd"}/>}
                    {!this.state.cargando &&<TouchableOpacity activeOpacity={0.8}
                        style={{
                            width: width - 50, padding: 15, alignItems: 'center', marginBottom: 20
                        }}
                        onPress={this.selectPhotoTapped.bind(this)}>
                        {this.state.avatarSource && <Image style={styles.avatar} source={this.state.avatarSource} />}
                        {!this.state.avatarSource && photo}
                    </TouchableOpacity>}

                    
                </View>
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        borderWidth: 1, borderRadius: 5, borderColor: '#D8383E', backgroundColor: '#CE5F63',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10, flexDirection: 'row',
                        alignItems: 'center', alignSelf: 'center'
                    }}
                    onPress={this.cerrarSesion}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 10 }}>Cerrar Sesion</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    }
});
