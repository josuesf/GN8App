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
  Vibration,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import InvitacionBox from '../components/InvitacionBox'
//import QRCodeScanner from 'react-native-qrcode-scanner';
import Camera from 'react-native-camera';
import store from '../store';
import { URL_WS_SOCKET } from '../Constantes'
import { Dialog } from 'react-native-simple-dialogs';
import QRCode from 'react-native-qrcode';
const { height, width } = Dimensions.get('window')
export default class Invitaciones extends Component<{}> {
  static navigationOptions = {
    title: 'Invitaciones',
    headerTintColor: 'purple',
    header: null,
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon
        name={focused ? 'md-barcode' : 'md-barcode'}
        size={26}
        color={focused ? tintColor : '#95a5a6'}
      />
    ),
  };
  constructor() {
    super()
    this.state = {
      scanning: true,
      resultado: '',
      invitaciones: [],
      refreshing: false,
      loadingMore: false,
      SeguirCargando: false,
      page: 1,
      modalCodigoQR: false,

    }
  }
  componentWillMount() {
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
          es_empresa: res.es_empresa,
        },
          () => {
            this.CargarInvitaciones()

          }
        )
      }
    })
  }
  componentDidMount() {
    store.subscribe(() => {
      if (this.refs.invitaciones && store.getState().nueva_invitacion) {
        this._onRefresh()
      }

    })
  }
  CargarInvitaciones = () => {
    const parametros = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: this.state.page,
        id_usuario_invitado: this.state.id
      })
    }
    fetch(URL_WS_SOCKET + "/ws/invitaciones_user", parametros)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.res == "ok") {
          if (this.state.page != 1)
            this.setState({
              invitaciones: [...this.state.invitaciones, ...responseJson.invitaciones],
              loadingMore: false,
              SeguirCargando: responseJson.invitaciones.length != 0 ? true : false
            })
          else
            this.setState({
              invitaciones: [],
              loadingMore: false,
              SeguirCargando: responseJson.invitaciones.length != 0 ? true : false
            }, () => { this.setState({ invitaciones: responseJson.invitaciones }) })
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
          page: this.state.page + 1,
          SeguirCargando: false
        },
        () => {
          this.CargarInvitaciones();
        }
      );

  };
  _onRefresh = () => {
    this.setState({ page: 1 }, () => { this.CargarInvitaciones() })
  }
  VerCodigoQR = (invitacion) => {
    this.setState({
      codigoqr: invitacion._id,
      codigoqr_des: invitacion.codigoqr_des,
      modalCodigoQR: true
    })
  }
  _handleBarCodeRead(e) {
    Vibration.vibrate();
    this.setState({
      scanning: false,
      buscandoInvitacion: true,
      resultado: e.data
    });

    const parametros = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_qr: e.data,
        id_usuario: this.state.id
      })
    }
    fetch(URL_WS_SOCKET + "/ws/VerificacionCodigo", parametros)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.res == "ok") {
          if (responseJson.invitacion.length > 0) {
            this.setState({
              buscandoInvitacion: false,
              codigoqr_des_encontrado: responseJson.invitacion[0].codigoqr_des,
              respuestaScanner: responseJson.invitacion[0].estado == "WAIT" ? true : false,
              codigoEncontrado: true
            })
          } else {
            this.setState({
              buscandoInvitacion: false,
              codigoEncontrado: false,
            })
          }
        } else {
          this.setState({ buscandoInvitacion: false })

        }
      })
      .catch(err => {
        this.setState({ buscandoInvitacion: false })
      })

    return;
  }
  render() {
    const { navigate } = this.props.navigation;
    const { scanning, es_empresa,
      buscandoInvitacion, codigoEncontrado,
      respuestaScanner, codigoqr_des_encontrado } = this.state

    return (
      <View style={styles.container} ref="invitaciones">
        <Toolbar navigation={navigate} banner={"C O D I G O S"} />
        {(es_empresa == "SI" && scanning) ?
          <View>
            <View style={styles.rectangleContainer}>
              <Camera style={styles.camera} type={this.state.cameraType}
                onBarCodeRead={this._handleBarCodeRead.bind(this)}>
                <View style={styles.rectangleContainer}>
                  <View style={styles.rectangle} />
                </View>
              </Camera>
            </View>
          </View> :
          <View style={{ alignItems: 'center' }}>
            {(buscandoInvitacion) ?
              <View>
                <Image source={require('../assets/img/loading.gif')}
                  style={{ marginVertical: 10, height: 80, width: 80, alignSelf: 'center' }} />
                <Text>Buscando ...</Text>
              </View> :
              codigoEncontrado ?
                <View style={{ alignItems: 'center' }}>
                  <Icon name="ios-checkmark-circle-outline" color={"#2ecc71"} size={100} />
                  <Text>{codigoqr_des_encontrado}</Text>
                  <TouchableOpacity onPress={() => this.setState({ scanning: true })}
                    style={{ marginVertical: 10, borderColor: '#831da2', padding: 10, borderWidth: 1, borderRadius: 10 }}>
                    <Text>OK</Text>
                  </TouchableOpacity>
                </View>
                : es_empresa == "SI" && <View style={{ alignItems: 'center' }}>
                  <Icon name="ios-close-circle-outline" color={"#c0392b"} size={100} />
                  <Text>No se encontro</Text>
                  <TouchableOpacity onPress={() => this.setState({ scanning: true })}
                    style={{ marginVertical: 10, borderColor: '#831da2', padding: 10, borderWidth: 1, borderRadius: 10 }}>
                    <Text>OK</Text>
                  </TouchableOpacity>
                </View>
            }
          </View>
        }
        {this.state.invitaciones.length == 0 ?
          <View style={{ alignItems: 'center' }}>
            <Icon name="ios-sad-outline" size={50} color="#831da2" />
            <TouchableOpacity onPress={() => navigate('home')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 10,
                borderWidth: 1, borderColor: '#831da2', padding: 10
              }}>

              <Text style={{ color: '#831da2' }}>BUSCAR CODIGOS</Text>
            </TouchableOpacity>

          </View>
          : <FlatList
            numColumns={2}
            data={this.state.invitaciones}
            renderItem={({ item }) => (
              <InvitacionBox invitacion={item} navigate={navigate} VerCodigoQR={() => this.VerCodigoQR(item)} />
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
        }



        <Dialog
          visible={this.state.modalCodigoQR}
          title={this.state.codigoqr_des}
          onTouchOutside={() => this.setState({ modalCodigoQR: false })}
          onRequestClose={() => this.setState({ modalCodigoQR: false })}
        >
          <View>

            <View style={{ alignItems: 'center', marginVertical: 10 }}>

              {!this.state.codigoqr &&
                <ActivityIndicator size="large" color="#d1c4e9" />}
              {this.state.codigoqr &&
                <View style={{ alignItems: 'center' }}>
                  <QRCode
                    value={this.state.codigoqr}
                    size={200}
                    bgColor='#333'
                    fgColor='white' />
                  <Text style={{ color: '#757575', marginVertical: 10 }}>Muestra por favor este codigo para canjearlo</Text>

                </View>}
            </View>
          </View>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  camera: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  rectangleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: height / 4,
    width: 200,
    borderWidth: 2,
    borderColor: '#831da2',
    backgroundColor: 'transparent',
  },
});
