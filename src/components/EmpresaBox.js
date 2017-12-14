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
const {width,height} = Dimensions.get('window')
const DEFAULT_AVATAR = './imgs/fg-avatar.png'
const AVATAR_SIZE = width/2-10
export default class EmpresaBox extends Component {
    state = {
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:10,marginTop:5,padding:5}}>
                    <Image source={require('../assets/img/userAvatar.jpeg')}
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, resizeMode: Image.resizeMode.contain }} />
                    
                </View>
                <Text style={{marginLeft:5,color:'#424242',fontWeight:'bold'}}>Caos Cusco</Text>
                <View style={{flexDirection:'row',width:width/2-10,alignItems:'center',padding:5}}>
                    <Icon name="ios-heart" size={30} color="#ab47bc" style={{marginRight:5}}/>
                    <Text style={{fontSize:10,fontWeight:'bold',color:'#9e9e9e'}}>a ti, josuesfl y 10 personas les encanta</Text>
                    
                </View>
                <View style={{flexDirection:'column',marginBottom:10,padding:5}}>
                    
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
        margin: 3,
        width: width/2-6
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