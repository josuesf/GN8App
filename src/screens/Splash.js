/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    StatusBar,
} from 'react-native';
import { AccessToken } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation'

export default class Splash extends Component<{}> {
    static navigationOptions = {
        header: null,
        tabBarLabel: 'Splash',
    };
    constructor() {
        super()
        this.state = {}
    }
    componentWillMount() {
        const main = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'main' })
            ]
        })
        const registerMain = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'registroMain' })
            ]
        })
        AsyncStorage.getItem("USER_DATA", (err, res) => {
            if (err) {
                this.props.navigation.dispatch(registerMain)
            } else {
                if (res != null) {
                    this.props.navigation.dispatch(main)
                } else {
                    this.props.navigation.dispatch(registerMain)
                }
            }
        })
        /*AccessToken.getCurrentAccessToken()
            .then(val => {
                if (val != null) {
                    this.props.navigation.dispatch(main)
                } else {
                    this.props.navigation.dispatch(registerMain)
                }
            })
            .catch(err => {
                this.props.navigation.dispatch(registerMain)
            })*/
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
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
