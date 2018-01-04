import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    AsyncStorage,
    RefreshControl,
    Alert,
} from 'react-native';
import PostBox from './PostBox'
import { URL_WS_SOCKET } from '../Constantes'
export default class ListaPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    _keyExtractor = (item, index) => index;
    
    render() {

        return (
            <FlatList
                data={this.props.posts}
                renderItem={({item}) => (
                        <PostBox post={item} navigate={this.props.navigate} />
                    
                )}
                refreshing={this.props.refreshing}
                onRefresh={this.props._onRefresh}
                keyExtractor={this._keyExtractor}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
    }

});