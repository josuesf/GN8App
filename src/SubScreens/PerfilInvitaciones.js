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
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    Image,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFondation from 'react-native-vector-icons/Foundation'
import { URL_WS_SOCKET } from '../Constantes'
import store from '../store'
import PostBox from '../components/PostBox'
import Boton from '../components/Boton';
import QRCode from 'react-native-qrcode';

const { width, height } = Dimensions.get('window')
export default class PerfilInvitaciones extends Component<{}> {

    constructor() {
        super()
        this.state = {
            SeguirCargando_qrs: false,
            page_qr: 1,
            invitaciones: [],
            refreshing_qrs: false
        }
    }


    ObtenerCodigoQR = () => {

    }
    componentDidMount() {
        this.CargarInvitaciones()
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
                id_usuario_invitado: store.getState().id
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
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container} ref="perfil">
                <FlatList
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
                {(this.state.invitaciones.length == 0) &&
                    <View >
                        <Text style={{
                            color: '#333', fontWeight: 'bold', fontSize: 30, ...Platform.select({
                                ios: { fontFamily: 'Arial', },
                                android: { fontFamily: 'Roboto' }
                            }), padding: 20
                        }}>Codigos canjeados</Text>
                        <Text style={{
                            color: '#333', ...Platform.select({
                                ios: { fontFamily: 'Arial', },
                                android: { fontFamily: 'Roboto' }
                            }), padding: 20
                        }}>
                            Aqui encontraras todos los codigos que canjeaste, mientras mas tengas acumularas mas puntos
                                </Text>
                        <Boton styleText={{ color: '#9b59b6' }} onPress={() => navigate('invitaciones')} text={"Empezar a escanear codigos"} />
                    </View>
                }


            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        borderRadius: 10,
        width: 100,
        height: 100
    }
});
