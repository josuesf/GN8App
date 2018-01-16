import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { URL_WS_SOCKET } from '../Constantes';

const { width, height } = Dimensions.get('window')
const DEFAULT_AVATAR = './imgs/fg-avatar.png'
const AVATAR_SIZE = 28
//const ulrimg='https://pbs.twimg.com/profile_images/495625237505916928/MO0m3zdN_400x400.jpeg'
//const ulrimg='https://scontent.flim1-1.fna.fbcdn.net/v/t31.0-8/23551173_1439994526110419_8624743476914670849_o.png?oh=a76945d198f3f5b96f63b50d5d766089&oe=5ACBD06D'
//const ulrimg = 'https://cdn-az.allevents.in/banners/1e4c3117bd34d35b92a889fb1b1625ae'
export default class InvitacionBox extends Component {
    constructor() {
        super()
        this.state = {
            heightImg: undefined,
            widthImg: width,

        }

    }
    getHeight = (ulrimg) => {
        Image.getSize(ulrimg,
            (w, h) => {
                if (this.refs.root)
                    this.setState({ heightImg: h / (w / width),width:w })
            },
            (error) => console.log('error'))
    }
    componentWillMount(){
        this.getHeight(this.props.invitacion.photo_post)
    }
    render() {
        
        return (
            <View ref='root' style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center',width:width/2-25, marginBottom: 0, marginTop: 5, padding: 5 }}>
                    <Image source={{ uri: this.props.invitacion.photo_url }}
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE,borderRadius:12 }} />
                    <Text style={{ marginLeft: 5, color: '#424242', fontWeight: 'bold' }}>{this.props.invitacion.nombre_usuario}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:10,marginTop:5,padding:5}}>
                <Image source={{ uri: this.props.invitacion.photo_post }}
                        style={{ height: 100, width: width/2-20,flex:1}}  />
                 
                </View>
                <View style={{ flexDirection: 'column',backgroundColor:'#fff', padding: 5, marginLeft: 10 }}>
                    <Text style={{ fontSize: 13, marginVertical: 3, fontWeight: 'bold', color: '#757575' }}>{this.props.invitacion.nombre_post}</Text>
                </View>
                <TouchableOpacity onPress={this.props.VerCodigoQR}
                    activeOpacity={0.3} style={{
                        flexDirection: 'row', backgroundColor: '#fff',
                        alignItems: 'center', justifyContent: 'center', padding: 5
                    }}>
                    <Icon name="md-barcode" size={40} color="#831da2" style={{ marginRight: 15 }} />

                </TouchableOpacity>

            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: .2,
        elevation:2,
        margin: 3,
        width: width/2-6,
        borderRadius:10,

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