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
const widthScreen = Dimensions.get('window').width
const DEFAULT_AVATAR = './imgs/fg-avatar.png'
const AVATAR_SIZE = 28
export default class PostBox extends Component {
    state = {
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:10,marginTop:5,padding:5}}>
                    <Image source={require('../assets/img/userAvatar.jpeg')}
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, resizeMode: Image.resizeMode.contain,borderRadius:300 }} />
                    <Text style={{marginLeft:5,color:'#424242',fontWeight:'bold'}}>Caos Cusco</Text>
                </View>
                <View style={{alignItems:'center',borderBottomWidth:1,borderTopWidth:1,borderColor:'#e0e0e0'}}>
                    <Image source={require('../assets/img/ejemplo1.jpg')}
                        style={{ width: widthScreen, }} />
                </View>
                <View style={{flexDirection:'row',alignItems:'center',padding:5,marginLeft:10}}>
                    <IconMaterial name="message-outline" size={30} color="#9e9e9e" style={{marginRight:15}}/>
                    <Icon name="ios-happy-outline" size={30} color="#9e9e9e" style={{marginRight:15}}/>
                    <IconMaterial name="beer" size={30} color="#9e9e9e" style={{marginRight:15}}/>
                    <IconMaterial name="qrcode" size={30} color="#9e9e9e" style={{marginRight:15}}/>
                    
                </View>
                <View style={{flexDirection:'column',marginBottom:10,padding:5,marginLeft:10}}>
                    <Text style={{fontSize:12,color:'#757575'}}>Alguna descripcion</Text>
                    <Text style={{fontSize:10,fontWeight:'bold',color:'#9e9e9e'}}>Hace 11 horas</Text>
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