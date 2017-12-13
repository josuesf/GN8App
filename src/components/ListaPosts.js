import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import PostBox from './PostBox'
export default class ListaPosts extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
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
    render() {

        return (
            <ListView
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(post) => {
                    return (
                        <PostBox post={post} />
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