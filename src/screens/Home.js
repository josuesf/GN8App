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
    Alert,
    ActivityIndicator,
    AsyncStorage,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import ListaPosts from '../components/ListaPosts'
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
import SocketIOClient from 'socket.io-client';
import store from '../store';
import { URL_WS_SOCKET } from '../Constantes';
const { width, height } = Dimensions.get('window')

export default class Home extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'home-outline' : 'home-outline'}
                size={26}
                color={focused ? tintColor : '#d1c4e9'}
            />
        ),
    };
    constructor() {
        super()
        this.state = {
            posts: [],
            buscandoPosts: true,
            refreshing: false,
        }
        
    }
    cargarDatosUsuarioStore = () => {
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (res != null) {
                res = JSON.parse(res)
                store.dispatch({
                    type: "SET_USER",
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
    componentDidMount(){
        store.getState().socket.on('posts', (data, cb) => {
            this.setState({posts:this.state.posts.concat(data)})
        });
    }
    componentWillMount() {
        this.cargarDatosUsuarioStore()
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(URL_WS_SOCKET + "/ws/posts", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({ posts: responseJson.posts, buscandoPosts: false })
                } else {
                    this.setState({ posts: responseJson.posts, buscandoPosts: false })
                }
            })
            .catch(err => {
                this.setState({ buscandoPosts: false })
                Alert.alert("Error", "Ocurrio un error al recuperar los posts")
            })
    }
    AbrirNuevoPost = () => {
        this.props.navigation.navigate('nuevoPost')
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Toolbar navigation={navigate} banner={"GN8"} />
                <TouchableOpacity onPress={this.AbrirNuevoPost}
                    activeOpacity={0.7} style={{ backgroundColor: '#F0F1F1', height: 50, paddingRight: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 5, padding: 5 }}>
                        <Image source={{ uri: store.getState().photoUrl }}
                            style={{ width: 28, height: 28, }} />
                        <View style={{
                            backgroundColor: '#FFF',
                            padding: 5, borderRadius: 10, marginHorizontal: 10,
                            flex: 1,
                        }}>
                            <Text style={{ marginLeft: 5, color: '#BBBFC3', fontWeight: 'bold' }}>
                                Publica todo lo que quieras
                            </Text>
                        </View>
                        <Icon name="ios-arrow-dropright" size={25} color="#5C6060" />

                    </View>
                </TouchableOpacity>
                {this.state.buscandoPosts && <ActivityIndicator color="#831DA2" size="large" style={{ marginTop: 10 }} />}

                <ListaPosts posts={this.state.posts} _onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing} navigate={navigate} />
            </View>
        );
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(URL_WS_SOCKET + "/ws/posts", parametros)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ refreshing: false, posts: [] })
                if (responseJson.res == "ok") {
                    this.setState({ refreshing: false, posts: responseJson.posts })
                } else {
                    this.setState({ refreshing: false, posts: responseJson.posts })
                }
            })
            .catch(err => {
                this.setState({ refreshing: false })
                Alert.alert("Error", "Ocurrio un error al recuperar los posts")
            })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});
