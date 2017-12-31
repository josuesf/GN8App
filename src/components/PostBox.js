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
import IconFont from 'react-native-vector-icons/FontAwesome'
const { width, height } = Dimensions.get('window')
const DEFAULT_AVATAR = './imgs/fg-avatar.png'
const AVATAR_SIZE = 28
//const ulrimg='https://pbs.twimg.com/profile_images/495625237505916928/MO0m3zdN_400x400.jpeg'
//const ulrimg='https://scontent.flim1-1.fna.fbcdn.net/v/t31.0-8/23551173_1439994526110419_8624743476914670849_o.png?oh=a76945d198f3f5b96f63b50d5d766089&oe=5ACBD06D'
//const ulrimg = 'https://cdn-az.allevents.in/banners/1e4c3117bd34d35b92a889fb1b1625ae'
export default class PostBox extends Component {
    constructor() {
        super()
        this.state = {
            heightImg: undefined,
            widthImg: width,
            esGenial: false,
            personasGenial: 0,
            comentarios:10,
        }

    }
    getHeight = (ulrimg) => {
        Image.getSize(ulrimg,
            (w, h) => {
                if (this.refs.root) {
                    this.setState({ heightImg: h / (w / width) })
                }
            },
            (error) => console.log('error'))
    }
    componentWillMount() {
        this.getHeight(this.props.post.photo_post)
    }
    darGenial = () => {
        var { personasGenial, esGenial } = this.state
        if (!esGenial) {
            personasGenial++
            this.setState({
                esGenial: true,
                personasGenial: personasGenial
            })

        } else {
            personasGenial--
            this.setState({
                esGenial: false,
                personasGenial: personasGenial
            })
        }

    }
    render() {
        const { esGenial, personasGenial,comentarios } = this.state
        
        return (
            <View ref="root" style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 5, padding: 5 }}>
                    <Image source={{ uri: this.props.post.photo_url }}
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, }} />
                    <Text style={{ marginLeft: 5, color: '#424242', fontWeight: 'bold' }}>{this.props.post.nombre_usuario}</Text>
                </View>
                <View style={{ alignItems: 'center', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#e0e0e0' }}>
                    <Image source={{ uri: this.props.post.photo_post }}
                        style={{ height: this.state.heightImg, width: width }} resizeMode='contain' />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, marginLeft: 10 }}>
                    <TouchableOpacity onPress={()=>this.props.navigate('comentarios',{id_post:this.props.post._id})}>
                        <IconMaterial name="message-text-outline" size={30} color={comentarios>0?"#831DA2":"#d1c4e9"} style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.darGenial}>
                        <IconMaterial name="emoticon-cool" size={30} color={esGenial ? "#831DA2" : "#d1c4e9"} style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                    {/*<IconMaterial name="beer" size={30} color="#d1c4e9" style={{ marginRight: 15 }} />*/}
                    <TouchableOpacity>
                        <IconMaterial name="qrcode" size={30} color="#d1c4e9" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', marginBottom: 10, padding: 5, marginLeft: 10 }}>
                    {personasGenial>0 &&<Text style={{ fontSize: 12, color: '#757575' }}>{"A "+personasGenial+" gusta esta publicacion"}</Text>}
                    {comentarios>0 &&<Text style={{ fontSize: 12, color: '#757575' }}>{comentarios+" comentarios"}</Text>}
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9e9e9e' }}>Hace 11 horas</Text>
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',

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