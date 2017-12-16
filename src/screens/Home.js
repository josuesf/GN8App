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

export default class CodigoQR extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header:null,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'home' : 'home-outline'}
                size={26}
                color={focused ? tintColor : '#d1c4e9'}
            />
        ),
    };
    constructor() {
        super()
        this.state = {
            posts:[{id:'1',urlImagen:'https://cdn-az.allevents.in/banners/1e4c3117bd34d35b92a889fb1b1625ae',avatar:'https://pbs.twimg.com/profile_images/425651955805863937/kP3_xfBz_400x400.jpeg'
            ,avatar:'https://pbs.twimg.com/profile_images/425651955805863937/kP3_xfBz_400x400.jpeg'},
            {id:'2',urlImagen:'https://scontent.flim1-1.fna.fbcdn.net/v/t31.0-8/23551173_1439994526110419_8624743476914670849_o.png?oh=a76945d198f3f5b96f63b50d5d766089&oe=5ACBD06D',
            avatar:'https://pbs.twimg.com/profile_images/425651955805863937/kP3_xfBz_400x400.jpeg'},
            {id:'3',urlImagen:'https://pbs.twimg.com/profile_images/495625237505916928/MO0m3zdN_400x400.jpeg',avatar:'https://pbs.twimg.com/profile_images/425651955805863937/kP3_xfBz_400x400.jpeg'},
            {id:'4',urlImagen:'https://scontent.flim1-1.fna.fbcdn.net/v/t31.0-8/20414219_1342043172572222_4325440949780527316_o.jpg?oh=6e5a3fef2ac892e893dd74a5dda8d4f4&oe=5ABAA5A7',
            avatar:'https://pbs.twimg.com/profile_images/425651955805863937/kP3_xfBz_400x400.jpeg'},
            {id:'5',urlImagen:'https://i.pinimg.com/736x/69/f7/7d/69f77d2daa63050d2c6a602252aa4e04--portrait-lighting-gel-lighting-photography-portraits.jpg',
            avatar:'https://pbs.twimg.com/profile_images/425651955805863937/kP3_xfBz_400x400.jpeg'}]
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Toolbar navigation={navigate} banner={"GN8"} />
                <ListaPosts posts={this.state.posts} />
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
