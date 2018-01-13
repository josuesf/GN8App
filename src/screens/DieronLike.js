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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
const { width, height } = Dimensions.get('window');
import { List, ListItem, SearchBar } from "react-native-elements";
import { URL_WS_SOCKET } from '../Constantes';
export default class DieronLike extends Component {
    static navigationOptions = {
        title: 'Les parece genial a...',
        headerTintColor: 'purple',
    };
    constructor() {
        super()

        this.state = {
            likes:[],
            buscandoLikes:true,
        }
    }
    _keyExtractor = (item, index) => index;
    componentWillMount(){
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                id_post:this.props.navigation.state.params.id_post
            })
        }
        fetch(URL_WS_SOCKET + "/ws/like_post", parametros)
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.res == "ok") {
                    this.setState({ likes: responseJson.likes, buscandoLikes: false })
                } else {
                    Alert.alert("Error",responseJson.detail)
                }
            })
            .catch(err => {
                this.setState({ buscandoLikes: false })
                Alert.alert("Error",err)
            })
    }
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View ref="personas" behavior="padding" style={styles.container}>
                {this.state.buscandoLikes && <ActivityIndicator color="#831DA2" size="large" style={{ marginTop: 10 }} />}
                <FlatList
                    data={this.state.likes}
                    
                    renderItem={({ item }) =>
                        (
                            item.like && <ListItem
                                roundAvatar
                                avatar={{ uri: URL_WS_SOCKET+item.photo_url }}
                                key={item.id_user}
                                title={item.nombre}
                                hideChevron
                                containerStyle={{ borderBottomWidth: 0.5,borderColor: "#CED0CE", }}
                            />
                        )
                    }
                    keyExtractor={this._keyExtractor}
                />
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