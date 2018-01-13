import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { URL_WS_SOCKET } from '../Constantes';
const { width, height } = Dimensions.get('window')
const DEFAULT_AVATAR = './imgs/fg-avatar.png'
const AVATAR_SIZE = width / 2 - 10
export default class EmpresaBox extends Component {
    state = {
    }
    render() {

        return (
            <View ref="root" style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 5, padding: 5 }}>
                    <Image source={{ uri: URL_WS_SOCKET+this.props.empresa.photo_url }}
                        style={{ width: AVATAR_SIZE - 10, height: AVATAR_SIZE, resizeMode: Image.resizeMode.contain }} />

                </View>
                <Text style={{ alignSelf:'center', color: '#424242', fontWeight: 'bold' }}>{this.props.empresa.name}</Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center',alignItems:'center', padding: 10 }}>
                    <Icon name={"ios-star"}
                        size={30} color={"#FFC300"} style={{ marginRight: 15 }} />
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9e9e9e' }}>{this.props.empresa.likes}</Text>

                </View>
                <View style={{ flexDirection: 'column', marginBottom: 10, padding: 5 }}>

                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: .2,
        elevation: 2,
        margin: 3,
        width: width / 2 - 6,
        borderRadius: 10,
    },
    image: {
        width: 50,
        height: 50,

    },
    info: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 11,
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: 5
    },
    subTitulo: {
        marginLeft: 5,
        fontSize: 11,
        fontWeight: 'bold',
        color: 'darkgray'
    },
    descripcion: {
        fontSize: 11,
        color: 'darkgray'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginTop: 15
    },
    iconContainer: {
        flexDirection: 'column',
        flex: 1,

    },
    icon: {
        alignItems: 'center',
    },
    count: {
        color: 'gray',
        textAlign: 'center'
    },
    avatar: {
        marginLeft: 15,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },

});