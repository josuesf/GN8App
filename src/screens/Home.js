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

export default class Home extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header:null,
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
            posts:[],
            buscandoPosts:true,
        }
        
    }
    componentWillMount(){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(URL_WS_SOCKET+"/ws/posts",parametros)
        .then(response=>response.json())
        .then(responseJson=>{
            if(responseJson.res=="ok"){
                this.setState({posts:responseJson.posts,buscandoPosts:false})
            }else{
                this.setState({posts:responseJson.posts,buscandoPosts:false})
            }
        })
        .catch(err=>{
            this.setState({buscandoPosts:false})
            Alert.alert("Error","Ocurrio un error al recuperar los posts")
        })
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Toolbar navigation={navigate} banner={"GN8"} />
                {this.state.buscandoPosts && <ActivityIndicator />}
                <ListaPosts posts={this.state.posts} navigate={navigate} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});
