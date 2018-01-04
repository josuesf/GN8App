import React from 'react'
import {
    Text,
    StyleSheet,
    View,
    Image,
} from 'react-native'

const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
const AVATAR_SIZE = 32

const Comment = (props) =>
    <View style={styles.comentContainer}>
        {
            props.avatar ?
                <Image style={styles.avatar} source={{ uri: props.avatar }} /> :
                <Image style={styles.avatar} source={{ uri: DEFAULT_AVATAR }} />
        }
        <View style={styles.comment}>
            <Text style={styles.nombre}>{props.user}</Text>
            <Text style={styles.text}>{props.text}</Text>
            <Text style={[styles.text,{fontWeight:'bold',fontSize:10,color:'#757575'}]}>{props.fecha}</Text>
        </View>

    </View>


const styles = StyleSheet.create({
    comentContainer:{
        margin: 3,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    comment: {
        backgroundColor: '#ecf0f1',
        padding: 5,
        margin: 5,
        borderRadius: 5,
        flexDirection: 'column',
        flex:1
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    text: {
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
        flexWrap: 'wrap',
        marginRight: 30
    },
    nombre: {
        marginLeft: 8,
        fontSize: 14,
        flex: 1,
        flexWrap: 'wrap',
        fontWeight: 'bold'
    }
})

export default Comment;