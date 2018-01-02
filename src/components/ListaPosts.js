import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    TouchableOpacity,
    AsyncStorage,
    RefreshControl,
    Alert,
} from 'react-native';
import PostBox from './PostBox'
import {URL_WS_SOCKET} from '../Constantes'
export default class ListaPosts extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            refreshing:false,
        }
    }
    componentDidMount() {

        this.updateDataSource(this.props.posts)
    }
    componentWillReceiveProps(newProps) {
        if (newProps.posts !== this.props.posts) {
            this.updateDataSource(newProps.posts)
        }
    }
    updateDataSource = data => {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(data) })
    }
    showDetail = (post) => {
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        const parametros = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(URL_WS_SOCKET+"/ws/posts",parametros)
        .then(response=>response.json())
        .then(responseJson=>{
            if(responseJson.res=="ok"){
                console.log(responseJson.posts)
                this.setState({refreshing:false,dataSource: this.state.dataSource.cloneWithRows(responseJson.posts)})
            }else{
                this.updateDataSource(responseJson.posts)
                this.setState({refreshing:false})
            }
        })
        .catch(err=>{
            this.setState({refreshing:false})
            Alert.alert("Error","Ocurrio un error al recuperar los posts")
        })
    }
    render() {

        return (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(post) => {
                    return (
                        <PostBox post={post} navigate={this.props.navigate} />
                    )
                }}
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