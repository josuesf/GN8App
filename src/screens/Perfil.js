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
    AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Toolbar from '../components/toolbar'
import { NavigationActions } from 'react-navigation'
import {
    LoginManager,
} from 'react-native-fbsdk'
const { width, height } = Dimensions.get('window')
export default class Perfil extends Component<{}> {
    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'purple',
        header: null,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <IconMaterial
                name={focused ? 'account-outline' : 'account-outline'}
                size={25}
                color={focused ? tintColor : '#d1c4e9'}
            />
        ),
    };
    constructor() {
        super()
        this.state = {

        }
    }
    cerrarSesion = () => {
        AsyncStorage.removeItem("USER_DATA", err => {
            if (!err) {
                const registerMain = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'registroMain' })
                    ]
                })
                this.props.navigation.dispatch(registerMain)
            }

        })

    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Toolbar navigation={navigate} banner={"Perfil"} />
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        borderWidth: 1, borderRadius: 5, borderColor: '#D8383E', backgroundColor: '#CE5F63',
                        width: width - 50, padding: 15, alignItems: 'center', marginBottom: 10, flexDirection: 'row',
                        alignItems: 'center', alignSelf: 'center'
                    }}
                    onPress={this.cerrarSesion}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 10 }}>Cerrar Sesion</Text>
                </TouchableOpacity>
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
