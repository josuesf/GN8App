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

const { width, height } = Dimensions.get('window')
export default class PerfilGuardados extends Component<{}> {

    constructor() {
        super()
        this.state = {
            refreshing: false,
            loadingMore: false,
            SeguirCargando: false,
            page: 1,
            posts: [],
        }
    }


    ObtenerCodigoQR = () => {

    }
    componentDidMount() {
        this.CargarPosts()
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
                id_usuario: store.getState().id,
            })
        }
        fetch(URL_WS_SOCKET + "/ws/posts_guardados", parametros)
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
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

        return (
            <View style={styles.container} ref="perfil">
                <FlatList
                    data={this.state.posts}
                    renderItem={({ item }) => (
                        <PostBox post={item} navigate={navigate}
                            ObtenerCodigoQR={() => this.ObtenerCodigoQR(item)} />
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
                />
                {(this.state.posts.length == 0) &&
                    <View >
                        <Text style={{
                            color: '#333', fontWeight: 'bold', fontSize: 30, ...Platform.select({
                                ios: { fontFamily: 'Arial', },
                                android: { fontFamily: 'Roboto' }
                            }), padding: 20
                        }}>Guardados</Text>
                        <Text style={{
                            color: '#333', ...Platform.select({
                                ios: { fontFamily: 'Arial', },
                                android: { fontFamily: 'Roboto' }
                            }), padding: 20
                        }}>
                            Aqui encontraras todas las publicaciones que guardaste para poder tenerlas al alcance mas rapido.
                    </Text>
                        <Boton styleText={{ color: '#9b59b6' }} onPress={() => navigate('home')} text={"Empezar a guardar publicaciones"} />
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
