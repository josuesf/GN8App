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
    KeyboardAvoidingView,
    AsyncStorage,
    ActivityIndicator,
    FlatList,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import SocketIOClient from 'socket.io-client';
import store from '../store';
import Comment from '../components/Comment'
import { URL_WS_SOCKET, URL_WS } from '../Constantes'
import moment from 'moment';
import 'moment/locale/es';
const { width, height } = Dimensions.get('window');
export default class Comentarios extends Component {
    static navigationOptions = {
        title: 'Comentarios',
        headerTintColor: 'purple',
    };
    constructor() {
        super()
        console.ignoredYellowBox = [
            'Setting a timer'
        ];

        this.state = {
            comments: [],
            text: "",
            buscandoComentarios: true,
            id_post: "",
            page: 1,
            NoHayMasComentarios: false,
            loading: false,
            SeguirCargando: true,
        }
        //this.socket = SocketIOClient(URL_WS_SOCKET);
        store.getState().socket.on('message', (data, cb) => {
            if (this.refs.comentarios) {
                this.setState({ comments: this.state.comments.reverse().concat(data).reverse() })
                //this.flatList.scrollToIndex();
            }
        });
    }

    componentDidMount() {

    }
    CargarComentarios = () => {
        this.setState({ loading: true })
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_post: this.props.navigation.state.params.id_post,
                page: this.state.page,
            })
        }
        //setTimeout(() => {
        fetch(URL_WS_SOCKET + "/ws/comments", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({
                        comments: this.state.page==1?
                        [...this.state.comments, ...responseJson.comments]
                        :this.state.comments.concat(responseJson.comments),
                        loading: false,
                        cargandoMas:false
                    }, () => {
                        //this.flatList.scrollToEnd();
                        //this.flatList.scrollToEnd({animated: true});
                        //this.flatList.scrollToOffset({ offset: 1 })
                    })

                } else {
                    this.setState({ loading: false,cargandoMas:false })
                    Alert.alert("Error", responseJson.detail)
                }
            })
            .catch(err => {
                this.setState({ loading: false,cargandoMas:false })
                Alert.alert("Error", err)
            })
        //}, 1500);

    }
    componentDidMount() {
        this.CargarComentarios()
    }

    handleSend = () => {
        message = {
            text: this.state.text,
            user: store.getState().nombre,
            id_user: store.getState().id,
            photo_url: store.getState().photoUrl,
            id_post: this.props.navigation.state.params.id_post,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        store.dispatch({
            type: 'POST_COMMENTED',
            id_post_commented: this.state.id_post,
        })
        this.setState({ text: "" }, () => {
            store.getState().socket.emit('message', message);
        })

        // this.setState({ text: "", comments: this.state.comments.concat(message) })


    }
    handleChangeText = (text) => this.setState({ text })
    CargarMasComentarios=()=>{
        this.setState({
            cargandoMas:true,
            page:this.state.page+1
        },this.CargarComentarios)
    }


    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        const { comments, NoHayMasComentarios } = this.state
        return (
            <View ref="comentarios" style={styles.container}>
                <FlatList
                    inverted
                    ref={(flatList) => { this.flatList = flatList; }}
                    data={comments}

                    renderItem={({ item }) =>
                        (
                            <Comment text={item.text} 
                                user={item.user}
                                avatar={item.photo_url}
                                fecha={moment(new Date(item.createdAt)).fromNow()} />
                        )
                    }
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={() =>
                        params.commentsCount > comments.length?
                        <View style={{ alignItems: 'center', }}>
                            {!this.state.cargandoMas ?
                                <TouchableOpacity onPress={this.CargarMasComentarios}
                                    style={{
                                        flexDirection: 'row', alignItems: 'center',
                                        padding: 10, borderRadius: 10, marginVertical: 5, backgroundColor: '#eee'
                                    }}>
                                    <Icon name="ios-sync" size={20} />
                                    <Text style={{ marginHorizontal: 10 }}>Mensajes anteriores</Text>
                                </TouchableOpacity> :
                                <ActivityIndicator size="large" color={"#831da2"} style={{paddingVertical:10}}/>
                            }

                        </View>:null
                    }
                />

                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.select({
                    ios: height / 10, android: -height / 3
                })}>
                    <View style={styles.inputContainer}>
                        <View style={{
                            height: 40, marginTop: 5, marginRight: 3, marginLeft: 3,
                            borderRadius: 20, flexDirection: 'row',
                            backgroundColor: '#ecf0f1'
                            , alignItems: 'center', padding: 5
                        }}>
                            <TextInput
                                underlineColorAndroid="transparent"
                                selectionColor="#6948A9"
                                style={styles.input}
                                value={this.state.text}
                                placeholder="Escribe un comentario..."
                                onChangeText={this.handleChangeText}
                                autoFocus={false}
                            />
                            <TouchableOpacity onPress={this.handleSend}
                                style={{ backgroundColor: 'transparent' }}>
                                <Icon name="md-send" size={30} color="#6948A9" style={{ padding: 10 }} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    inputContainer: {
        height: 50,
        backgroundColor: '#FFF',
        width: width,
        borderTopWidth: 1,
        borderColor: '#ecf0f1'
    },
    input: {
        flex: 1,
        height: 50,
    },
    header: {
        fontSize: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    titulos: {
        fontWeight: "900",
        paddingBottom: 3,
    },
    participantesBox: {
        alignItems: 'center',
        margin: 5,
        marginRight: 0,
        marginLeft: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: {
            height: 1,
            width: -2
        },
        elevation: 2,
        padding: 5,
        height: 50,
    },
    map: {
        height: 80,

    },
});