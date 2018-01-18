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
import Boton from '../components/Boton';
const { height, width } = Dimensions.get('window')
export default class Invitaciones extends Component<{}> {
  static navigationOptions = {
    title: 'Invitaciones',
    headerTintColor: 'purple',
    header: null,
    tabBarLabel: Platform.OS=='android'?({ tintColor, focused }) => (
      <Text style={{fontSize:10,color:focused ? tintColor : '#95a5a6'}}>
          CODIGOS
      </Text>
  ):"CODIGOS",
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

  render() {
    const { navigate } = this.props.navigation;


    return (
      <View style={styles.container} ref="invitaciones">
        
        {this.state.es_empresa == "SI" &&
          <Boton text={"Abrir Scanner"} />
        }
        {this.state.invitaciones.length == 0 ?
          <View >
            <Text style={{
              color: '#333', fontWeight: 'bold', fontSize: 30, ...Platform.select({
                ios: { fontFamily: 'Arial', },
                android: { fontFamily: 'Roboto' }
              }), padding: 20
            }}>Codigos</Text>
            <Text style={{
              color: '#333', ...Platform.select({
                ios: { fontFamily: 'Arial', },
                android: { fontFamily: 'Roboto' }
              }), padding: 20
            }}>
            Busca tu codigo de canje para pases libres, ofertas, promociones, descuentos y mucho mas.
            </Text>
            <Boton styleText={{ color: '#9b59b6' }} onPress={() => navigate('home')} text={"Empezar a buscar codigos"} />

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
    backgroundColor: '#fff',
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
