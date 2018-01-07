import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    ScrollView,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');
import { FormLabel, FormInput, CheckBox, FormValidationMessage } from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { URL_WS_SOCKET } from '../Constantes';
import store from '../store';
export default class NuevoPost extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Nueva Publicacion',
            headerTintColor: 'purple',
            headerRight: (
                <TouchableOpacity
                    onPress={params.handleSave ? params.handleSave : () => null}
                    style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginHorizontal: 5, color: 'purple' }}>Publicar</Text>
                    <IconMaterial name="check-circle" color={"purple"} size={25} />
                </TouchableOpacity>
            ),
        };
    };
    componentDidMount() {
        // We can only set the function after the component has been initialized
        this.props.navigation.setParams({ handleSave: this.storePicture });
    }
    constructor() {
        super()

        this.state = {
            publicando: false,
            avatarSource: null,
            videoSource: null,
            dataImg: null,
            codigoqr: true,
            //Datos
            codigoqr_des: '',
            nombre_post: '',
            descripcion: ''

        }
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
                this.getHeight(response.uri)
                this.setState({
                    avatarSource: source,
                    dataImg: response.data
                });
                //this.storePicture()
            }
        });
    }
    validarCampos = () => {
        if (!this.state.dataImg) {
            Alert.alert("Suba una imagen", "Captura o sube una foto de tu galeria")
            return false
        } else {
            if (this.state.nombre_post == "") {
                this.setState({ error_nombre: true })
                this.refs.nombreInput.focus()
                this.refs.nombreInput.shake()
                return false
            } else {
                if (this.state.descripcion == "") {
                    this.setState({ error_descripcion: true })
                    this.refs.descripcionInput.focus()
                    this.refs.descripcionInput.shake()
                    return false
                } else {
                    if (this.state.codigoqr) {
                        if (this.state.codigoqr_des == "") {
                            this.setState({ error_codigoqr_des: true })
                            this.refs.qrdesInput.focus()
                            this.refs.qrdesInput.shake()
                            return false
                        } else return true
                    } else
                        return true;
                }
            }
        }

    }
    storePicture = () => {
        if (this.validarCampos()) {

            this.setState({ publicando: true,ErrorPublicacion:false })
            const data = [
                { name: 'nombre_post', data: this.state.nombre_post },
                { name: 'descripcion', data: this.state.descripcion },
                { name: 'codigoqr', data: this.state.codigoqr ? "1" : "0" },
                { name: 'codigoqr_des', data: this.state.codigoqr_des },
                { name: 'id_usuario', data: store.getState().id },
                { name: 'nombre_usuario', data: store.getState().nombre },
                { name: 'photo_url', data: store.getState().photoUrl },
                { name: 'picture', filename: Date.now().toString() + store.getState().id + '.png', data: this.state.dataImg }
            ]
            RNFetchBlob.fetch('POST', URL_WS_SOCKET + "/ws/create_post", {
                Authorization: "Bearer access-token",
                otherHeader: "foo",
                'Content-Type': 'multipart/form-data',
            }, data)
                .then(res => {
                    if (res.respInfo.status == 200)
                        this.props.navigation.goBack()
                    else{
                        this.setState({ publicando: false,ErrorPublicacion:true })
                        
                    }
                })
                .catch(err => {
                    this.setState({ publicando: false })
                    console.log(err)
                })
        }

    }
    getHeight = (ulrimg) => {
        Image.getSize(ulrimg,
            (w, h) => {
                if (this.refs.new_post) {
                    this.setState({ heightImg: h / (w / width) })
                }
            },
            (error) => console.log('error'))
    }

    render() {
        const { navigate, goBack } = this.props.navigation;
        const photo = this.state.photoUrl && this.state.photoUrl != "sin_imagen" ?
            <Image source={{ uri: this.state.photoUrl }} style={{ borderRadius: 50, height: 100, width: 100 }} />
            : <Icon name="ios-images-outline" size={100} color="#9e9e9e" style={{ alignSelf: 'center' }} />

        return (
            <View ref="new_post" style={styles.container}>
                <ScrollView>
                    {this.state.ErrorPublicacion && <Text style={{alignSelf:'center',marginVertical:10,color:'red'}}
                    >No se puedo subir su publicacion,intentelo luego</Text>}
                    <ProgressDialog
                        visible={this.state.publicando}
                        title="Publicando"
                        message="Por favor, espere..."
                    />
                    <FormLabel labelStyle={{ color: '#333', fontSize: 15 }}>Sube una imagen para tu publicacion</FormLabel>
                    <View style={{ flexDirection: 'row', width, justifyContent: 'center', marginBottom: 0 }}>

                        <TouchableOpacity activeOpacity={0.8}
                            style={{
                                padding: 0, marginTop: 10,

                            }}
                            onPress={this.selectPhotoTapped.bind(this)}>
                            {this.state.avatarSource &&
                                <Image style={{ width, height: this.state.heightImg }} source={this.state.avatarSource} />}
                            {!this.state.avatarSource && photo}

                        </TouchableOpacity>
                    </View>
                    <FormLabel labelStyle={{ color: '#333', fontSize: 15 }}>Nombre de tu publicacion</FormLabel>
                    <FormInput ref='nombreInput'
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.refs.descripcionInput.focus();
                        }}
                        underlineColorAndroid="#eee"
                        value={this.state.nombre}
                        onChangeText={(text) => this.setState({ nombre_post: text, error_nombre: false })} />
                    {this.state.error_nombre && <FormValidationMessage>Este campo es obligatorio</FormValidationMessage>}

                    <FormLabel labelStyle={{ color: '#333', fontSize: 15 }}>Describa brevemente su evento</FormLabel>
                    <FormInput ref='descripcionInput' underlineColorAndroid="#eee"
                        onChangeText={(text) => this.setState({ descripcion: text, error_descripcion: false })} />
                    {this.state.error_descripcion && <FormValidationMessage>Este campo es obligatorio</FormValidationMessage>}
                    <CheckBox
                        containerStyle={{ marginTop: 10, backgroundColor: '#FFF', borderWidth: 0 }}
                        textStyle={{ color: '#333', fontSize: 15 }}
                        title='Codigo de canje(recomendado)'
                        checked={this.state.codigoqr}
                        iconType='material'
                        checkedIcon='check-box'
                        uncheckedIcon='check-box-outline-blank'
                        checkedColor='purple'
                        onPress={() => this.setState({ codigoqr: !this.state.codigoqr })}
                    />
                    {this.state.codigoqr &&
                        <View>
                            <FormInput ref="qrdesInput"
                                placeholder={"Que se puede canjear con el codigo?"}
                                underlineColorAndroid="#eee"
                                onChangeText={(text) => this.setState({ codigoqr_des: text, error_codigoqr_des: false })} />
                            {this.state.error_codigoqr_des && <FormValidationMessage>Este campo es obligatorio</FormValidationMessage>}
                            <IconMaterial name="qrcode" size={100} color="purple" style={{ alignSelf: 'center', marginTop: 10 }} />
                        </View>
                    }


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
});