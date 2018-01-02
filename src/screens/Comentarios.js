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
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import CommentList from '../components/CommentList'
import SocketIOClient from 'socket.io-client';
import store from '../store';
import { URL_WS_SOCKET, URL_WS } from '../Constantes'
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
            id_post:""
        }
        this.socket = SocketIOClient(URL_WS_SOCKET);
        this.socket.on('message', (data, cb) => {
            if (this.refs.comentarios)
                this.setState({ comments: this.state.comments.concat(data) })
        });
    }

    componentDidMount() {

    }
    addComment = (data) => {
        const comment = data.val()
        this.setState({
            comments: this.state.comments.concat(comment)
        })
    }
    componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({id_post:params.id_post})
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                id_post:params.id_post
            })
        }
        fetch(URL_WS_SOCKET + "/ws/comments", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({ comments: responseJson.comments, buscandoComentarios: false })
                }else{
                    this.setState({ comments: responseJson.comments, buscandoComentarios: false })
                }
            })
            .catch(err => {
                this.setState({ buscandoComentarios: false })
                Alert.alert("Error", err)
            })
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

    handleSend = () => {
        message = {
            text: this.state.text,
            user: this.state.nombre,
            id_user: this.state.id,
            photo_url: this.state.photoUrl,
            id_post: this.state.id_post
        }
        store.dispatch({
            type: 'POST_COMMENTED',
            id_post_commented: this.state.id_post,
        })
        this.socket.emit('message', message);
        this.setState({ text: "", comments: this.state.comments.concat(message) })

    }
    componentWillUnmount() {
        this.socket.close()
        this.socket.disconnect()
    }
    handleChangeText = (text) => this.setState({ text })

    render() {
        const { navigate } = this.props.navigation;
        const { comments } = this.state

        return (
            <View ref="comentarios" behavior="padding" style={styles.container}>
                {this.state.buscandoComentarios && <ActivityIndicator />}
                <CommentList comments={comments} />
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
                            autoFocus={true}
                        />
                        <TouchableOpacity onPress={this.handleSend}
                            style={{ backgroundColor: 'transparent' }}>
                            <Icon name="md-send" size={30} color="#6948A9" style={{ padding: 10 }} />
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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