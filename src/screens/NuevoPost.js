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
    Platform,
    BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFondation from 'react-native-vector-icons/Foundation'
import MapView from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import { FormLabel, FormInput, CheckBox, FormValidationMessage } from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { URL_WS_SOCKET } from '../Constantes';
import store from '../store';
import Boton from '../components/Boton';


const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;
export default class NuevoPost extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: '',
            headerTintColor: 'black',
            header: null,
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
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.paso2) {
                this.VolverPaso1()
                return true
            }
            if (this.state.paso3) {
                this.VolverPaso2()
                return true
            }
            return false
        });
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
            descripcion: '',

            paso1: true,
            paso2: false,
            paso3: false,

            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [],
        }
        this.onMapPress = this.onMapPress.bind(this);


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
    storePicture = () => {
        if (this.validarCampos()) {

            this.setState({ publicando: true, ErrorPublicacion: false })
            const data = [
                { name: 'nombre_post', data: this.state.nombre_post },
                { name: 'descripcion', data: this.state.descripcion },
                { name: 'codigoqr', data: this.state.codigoqr ? "1" : "0" },
                { name: 'codigoqr_des', data: this.state.codigoqr_des },
                { name: 'id_usuario', data: store.getState().id },
                { name: 'nombre_usuario', data: store.getState().nombre },
                { name: 'photo_url', data: store.getState().photoUrl },
                { name: 'latitude', data: (this.state.markers[0].coordinate.latitude).toString() },
                { name: 'longitude', data: (this.state.markers[0].coordinate.longitude).toString() },
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
                    else {
                        this.setState({ publicando: false, ErrorPublicacion: true })

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

    componentWillMount() {
        //requestLocationPermission()
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    error: null,
                })
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        );


    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }
    onMapPress(e) {
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: e.nativeEvent.coordinate,
                    key: `foo${id++}`,
                },
            ],
            region: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }
        });
    }
    SigPaso2 = () => {
        this.setState({ paso1: false, paso2: true, paso3: false })
    }
    SigPaso3 = () => {
        this.setState({ paso1: false, paso2: false, paso3: true })
    }
    VolverPaso1 = () => {
        this.setState({ paso1: true, paso2: false, paso3: false })
    }
    VolverPaso2 = () => {
        this.setState({ paso1: false, paso2: true, paso3: false })
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        const { markers } = this.state
        return (
            <View ref="new_post" style={styles.container}>
                <ProgressDialog
                    activityIndicatorColor={"#9b59b6"}
                    activityIndicatorSize="large"
                    visible={this.state.publicando}
                    title="Publicando"
                    message="Por favor, espere..."
                />
                {this.state.paso1 && <ScrollView>
                    <View style={[styles.toolbar]} >
                        <TouchableOpacity onPress={() => goBack()} style={{ flex: 1 }}>
                            <IconFondation name="x" size={30} color="#95a5a6"
                                style={{ marginHorizontal: 20, marginVertical: 10 }} />
                        </TouchableOpacity>
                        <Boton text="Siguiente" onPress={this.SigPaso2}
                            styleText={{ color: '#FFF', fontWeight: 'bold' }}
                            styleBoton={{
                                backgroundColor: '#9b59b6', marginHorizontal: 5,
                                paddingVertical: 10, borderRadius: 5
                            }} />
                    </View>
                    {this.state.ErrorPublicacion && <Text style={{ alignSelf: 'center', marginVertical: 10, color: 'red' }}
                    >No se puedo subir su publicacion,intentelo luego</Text>}
                    <FormLabel labelStyle={{ color: '#7f8c8d', fontSize: 15 }}>1 • Nombre de tu publicacion</FormLabel>
                    <FormInput ref='nombreInput'
                        autoFocus={true}
                        autoCorrect={false}
                        underlineColorAndroid="#eee"
                        value={this.state.nombre_post}
                        onChangeText={(text) => this.setState({ nombre_post: text, error_nombre: false })} />
                    {this.state.error_nombre && <FormValidationMessage>Es necesario ingresar un nombre para tu publicacion</FormValidationMessage>}
                    <TouchableOpacity activeOpacity={0.8}
                        onPress={this.selectPhotoTapped.bind(this)}
                        style={{
                            flexDirection: 'column', flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>

                        {this.state.avatarSource ?
                            <Image style={{ width, height: this.state.heightImg }} source={this.state.avatarSource} />
                            : <Icon name="ios-images-outline" size={200} color="#9e9e9e" style={{ alignSelf: 'center' }} />}

                        <Text style={{ color: "#9b59b6", fontWeight: 'bold', marginVertical: 10, alignSelf: 'center' }}>
                            Toca para seleccionar una imagen
                        </Text>
                    </TouchableOpacity>
                </ScrollView>}
                {this.state.paso2 && <View>
                    <View style={[styles.toolbar]} >
                        <TouchableOpacity onPress={this.VolverPaso1} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <IconMaterial name="arrow-left" size={30} color="#95a5a6"
                                style={{ marginHorizontal: 10, marginVertical: 10 }} />
                            <Text style={{ color: '#95a5a6', fontWeight: 'bold' }}>Volver al paso 1</Text>
                        </TouchableOpacity>
                        <Boton text="Siguiente" onPress={this.SigPaso3} styleText={{ color: '#FFF', fontWeight: 'bold' }}
                            styleBoton={{ backgroundColor: '#9b59b6', marginHorizontal: 5, paddingVertical: 10, borderRadius: 5 }} />
                    </View>
                    <CheckBox
                        containerStyle={{ marginTop: 10, backgroundColor: '#FFF', borderWidth: 0 }}
                        textStyle={{ color: '#7f8c8d', fontSize: 15 }}
                        title='Ofrecer Codigo'
                        checked={this.state.codigoqr}
                        iconType='material'
                        checkedIcon='check-box'
                        uncheckedIcon='check-box-outline-blank'
                        checkedColor='purple'
                        onPress={() => this.setState({ codigoqr: !this.state.codigoqr })}
                    />
                    <Text style={{ color: '#7f8c8d', marginLeft: 20, marginVertical: 10 }}>
                        Con este codigo puedes ofrecer invitaciones,ofertas, pases libres y todo lo que tu quieras.
                            </Text>
                    {this.state.codigoqr &&
                        <View>
                            <FormLabel labelStyle={{ color: '#7f8c8d', fontSize: 15 }}>• Que ofrecera tu codigo?</FormLabel>
                            <FormInput ref="qrdesInput"
                                placeholder={"Ejm: Pase libre, 10% de descuento ..."}
                                underlineColorAndroid="#eee"
                                onChangeText={(text) => this.setState({ codigoqr_des: text, error_codigoqr_des: false })} />
                            {this.state.error_codigoqr_des && <FormValidationMessage>Este campo es obligatorio</FormValidationMessage>}
                            <IconMaterial name="qrcode" size={200} color="purple" style={{ alignSelf: 'center', marginTop: 10 }} />

                        </View>
                    }
                </View>
                }
                {this.state.paso3 && <View style={[styles.toolbar]} >
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={this.VolverPaso2} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <IconMaterial name="arrow-left" size={30} color="#95a5a6"
                                style={{ marginHorizontal: 10, marginVertical: 10 }} />
                            <Text style={{ color: '#95a5a6', fontWeight: 'bold' }}>Volver al paso 2</Text>
                        </TouchableOpacity>
                    </View>

                </View>}
                {this.state.paso3 && <View style={styles.containerMapa}>

                    <MapView
                        provider={this.props.provider}
                        style={styles.map}
                        region={this.state.region}
                        onPress={markers.length == 0 ? this.onMapPress : null}
                        showsUserLocation={true}
                    >
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                //pinColor={"blue"}
                                //image={flagPinkImg}
                                key={marker.key}
                                coordinate={marker.coordinate}
                            >
                                <IconFondation name="marker" size={50} color="#9b59b6" />
                            </MapView.Marker>
                        ))}
                    </MapView>
                    <View style={styles.buttonContainer}>
                        {markers.length == 0 ?
                            <View
                                onPress={() => this.setState({ markers: [] })}
                                style={[{
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    paddingVertical: 18, width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <IconFondation name="marker" size={30} />
                                <Text style={{ marginHorizontal: 10, fontWeight: 'bold' }}>Toca donde quieras establecer tu punto exacto</Text>
                            </View> :
                            <View>
                                <TouchableOpacity
                                    onPress={this.storePicture}
                                    style={[styles.bubble, { flexDirection: 'row', backgroundColor: '#9b59b6', alignItems: 'center' }]}
                                >
                                    <IconFondation name="check" size={30} color="#FFF" />
                                    <Text style={{ marginHorizontal: 10, fontWeight: 'bold', color: 'white' }}>Publicar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ markers: [] })}
                                    style={[styles.bubble, { flexDirection: 'row', alignItems: 'center', marginVertical: 20 }]}
                                >
                                    <IconFondation name="refresh" size={30} />
                                    <Text style={{ marginHorizontal: 10, fontWeight: 'bold' }}>Reintentar</Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </View>
                }
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
        width,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        ...Platform.select({
            ios: {
                marginTop: 20,
            },
        }),
    },

    containerMapa: {
        //...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
});