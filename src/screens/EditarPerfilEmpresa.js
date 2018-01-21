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
import {CheckBox} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import { NavigationActions } from 'react-navigation'
import { URL_WS, URL_WS_SOCKET } from '../Constantes'
import ImagePicker from 'react-native-image-picker';
import store from '../store'
import RNFetchBlob from 'react-native-fetch-blob'
import { FormLabel, FormInput,FormValidationMessage } from 'react-native-elements'

const { width, height } = Dimensions.get('window')
export default class EditarPerfil extends Component<{}> {
    static navigationOptions = {
        title: 'Editar Perfil de Empresa',
        headerTintColor: 'purple',
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
            categorias:'',
            cargando: false,
            avatarSource: null,
            videoSource: null,
            dataImg: null,
            checkBar:false,
            checkBebidas:false,
            checkComidas:false,
            checkDiscoteca:false,
            checkRopa:false,
        }
    }
    componentWillMount() {
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            
            if (res != null) {
                res = JSON.parse(res)
                var categoriasSplit=res.categorias
                categoriasSplit=categoriasSplit.split(' ')
                this.setState({
                    id: res.id,
                    correo: res.email,
                    nombre: res.name,
                    usuario: res.username,
                    password: res.password,
                    photoUrl: res.photo_url,
                    direccion:res.direccion,
                    telefono:res.telefono,
                    es_empresa: res.es_empresa,
                    categorias:res.categorias,
                    checkBar:categoriasSplit.indexOf('BAR')!=-1,
                    checkBebidas:categoriasSplit.indexOf('BEBIDAS')!=-1,
                    checkComidas:categoriasSplit.indexOf('COMIDAS')!=-1,
                    checkDiscoteca:categoriasSplit.indexOf('DISCOTECA')!=-1,
                    checkRopa:categoriasSplit.indexOf('ROPA')!=-1,
                })
            }
        })
    }
    cerrarSesion = () => {
        AsyncStorage.removeItem("USER_DATA", err => {
            if (!err) {
                AsyncStorage.removeItem("POSTS")
                AsyncStorage.removeItem("EMPRESAS")
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
            maxWidth: 200,
            maxHeight: 200,
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
        this.setState({ cargando: true })
        const data = [
            { name: 'id', data: this.state.id },
            { name: 'picture', filename: this.state.id+Date.now()+'.png', data: this.state.dataImg }
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
                        this.setState({ cargando: false })

                    }).catch(err => console.log('Error'));
                } else {
                    this.setState({ cargando: false })
                    Alert.alert("Error", "No se pudo subir su imagen vuelva a intentarlo")
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ cargando: false, avatarSource: null })
                Alert.alert("Error", "No se pudo subir su imagen vuelva a intentarlo")
            })



    }
    guardarCambios = () => {
        this.setState({ 
            cargando: true,
            categorias: `${this.state.checkBar?'BAR ':''}${this.state.checkBebidas?'BEBIDAS ':''}${this.state.checkComidas?'COMIDAS ':''}${this.state.checkDiscoteca?'DISCOTECA ':''}${this.state.checkRopa?'ROPA ':''}`
        })

        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.nombre,
                username: (this.state.usuario).toLocaleLowerCase().trim(),
                email: (this.state.correo).toLocaleLowerCase().trim(),
                password: this.state.password,
                photo_url: this.state.photoUrl,
                categorias: this.state.categorias,
            })
        }
        fetch(URL_WS + '/ws/updateUser', parametros)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.res == "ok") {
                    const user = responseJson.user
                    const user_data = {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        photo_url: user.photo_url,
                        categorias: user.categorias,
                    }
                    AsyncStorage.setItem('USER_DATA', JSON.stringify(user_data), () => {
                        this.setState({ cargando: false })
                        store.dispatch({
                            type: 'USER_UPDATE',
                            user_update: true,
                        })
                        this.props.navigation.goBack()
                    }).catch(err => console.log('Error'));
                } else {
                    this.setState({ cargando: false })
                    Alert.alert("Error", "No se pudo subir su imagen vuelva a intentarlo")
                }
            })
            .catch(err => {
                this.setState({ cargando: false })
                Alert.alert("Error", "No se pudo actualizar")
            })
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: this.state.photoUrl }} style={{ borderRadius: 50, height: 100, width: 100 }} />
            : <Icon name="ios-camera" size={100} color="#9e9e9e" style={{ marginRight: 15 }} />

        return (
            <View style={styles.container}>
                
                <ScrollView>
                    <View style={styles.container}>
                        {this.state.cargando &&
                            <ActivityIndicator style={{ marginTop: 20 }} size="large" color={"#9575cd"} />}

                        <View style={{ flexDirection: 'row', width, justifyContent: 'center', marginBottom: 30 }}>

                            <TouchableOpacity activeOpacity={0.8}
                                style={{
                                    padding: 0, marginTop: 10,

                                }}
                                onPress={this.selectPhotoTapped.bind(this)}>
                                {this.state.avatarSource && <Image style={styles.avatar} source={this.state.avatarSource} />}
                                {!this.state.avatarSource && photo}

                            </TouchableOpacity>
                        </View>
                        <FormLabel>Nombre</FormLabel>
                        <FormInput underlineColorAndroid="#eee" value={this.state.nombre} onChangeText={(text)=>this.setState({nombre:text})} />
                        <FormLabel>Usuario</FormLabel>
                        <FormInput underlineColorAndroid="#eee" editable={true} value={this.state.usuario} onChangeText={(text)=>this.setState({usuario:text})} />
                        <FormLabel>Correo</FormLabel>
                        <FormInput underlineColorAndroid="#eee" editable={false} value={this.state.correo} onChangeText={(text)=>this.setState({correo:text})} />
                        <FormLabel>Direccion</FormLabel>
                        <FormInput underlineColorAndroid="#eee" editable={true} value={this.state.direccion} onChangeText={(text)=>this.setState({correo:text})} />
                        <FormLabel>Telefono</FormLabel>
                        <FormInput underlineColorAndroid="#eee" editable={true} value={this.state.telefono} onChangeText={(text)=>this.setState({correo:text})} />
                        
                        <FormLabel>Servicios de Empresa</FormLabel>
                        <CheckBox  title='Bar'
                            checked={this.state.checkBar}
                            size={20}
                            checkedColor='purple'
                            textStyle={
                                {
                                    fontSize:12,
                                }
                            }
                            onPress = {
                                ()=>{this.setState({checkBar:!this.state.checkBar})}
                            }
                        />
                        <CheckBox  title='Bebidas'
                            checked={this.state.checkBebidas}
                            size={20}
                            checkedColor='purple'
                            textStyle={
                                {
                                    fontSize:12,
                                }
                            }
                            onPress = {
                                ()=>{this.setState({checkBebidas:!this.state.checkBebidas})}
                            }
                        />
                        <CheckBox  title='Comidas'
                            checked={this.state.checkComidas}
                            size={20}
                            checkedColor='purple'
                            textStyle={
                                {
                                    fontSize:12,
                                }
                            }
                            onPress = {
                                ()=>{this.setState({checkComidas:!this.state.checkComidas})}
                            }
                        />
                        <CheckBox  title='Discoteca'
                            checked={this.state.checkDiscoteca}
                            size={20}
                            checkedColor='purple'
                            textStyle={
                                {
                                    fontSize:12,
                                }
                            }
                            onPress = {
                                ()=>{this.setState({checkDiscoteca:!this.state.checkDiscoteca})}
                            }
                        />
                        <CheckBox  title='Ropa'
                            checked={this.state.checkRopa}
                            size={20}
                            checkedColor='purple'
                            textStyle={
                                {
                                    fontSize:12,
                                }
                            }
                            onPress = {
                                ()=>{this.setState({checkRopa:!this.state.checkRopa})}
                            }
                        />
                        
                        
                        <View style={{ flexDirection: 'row', width, justifyContent: 'center', marginTop: 50, marginBottom: 50 }}>
                            <TouchableOpacity onPress={this.guardarCambios}
                                activeOpacity={0.8} style={styles.botonGuardar}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Guardar Cambios</Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                    <TouchableOpacity activeOpacity={0.8}
                        style={{
                            backgroundColor: '#FFF',
                            width: width, padding: 15, alignItems: 'center', marginBottom: 0,
                            flexDirection: 'row',
                            alignSelf: 'center', justifyContent: 'center'
                        }}
                        onPress={this.cerrarSesion}>
                        <Text style={{ color: '#CE5F63' }}>Cerrar Sesion</Text>
                    </TouchableOpacity>
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
        borderRadius: 10,
        width: 100,
        height: 100
    },
    toolbar: {
        width, backgroundColor: '#fcfcfc',
        flexDirection: 'row', elevation: 1.5,
        height: 50, alignItems: 'center',
        ...Platform.select({
            ios: {
                borderBottomWidth: 0.5, marginTop: 10, borderColor: '#bdc3c7',
            },
        }),
    },
    inputDato: { fontWeight: '900', marginBottom: 10 },
    labelDato: { fontWeight: '900', marginBottom: 10 },
    boxInput: { margin: 10 },
    botonGuardar: {
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowColor: 'black',
        shadowOpacity: 0.4, elevation: 5,
        borderWidth: 1, borderRadius: 2, borderColor: '#9b59b6', backgroundColor: '#9b59b6',
        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center'
    }
});
