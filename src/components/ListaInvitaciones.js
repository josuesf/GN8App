import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    TouchableOpacity,
    AsyncStorage,
    RefreshControl,
} from 'react-native';
import InvitacionBox from './InvitacionBox'
export default class ListaInvitaciones extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            refreshing:false,
        }
    }
    componentDidMount() {

        this.updateDataSource(this.props.invitaciones)
    }
    componentWillReceiveProps(newProps) {
        if (newProps.invitaciones !== this.props.invitaciones) {
            this.updateDataSource(newProps.invitaciones)
        }
    }
    updateDataSource = data => {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(data) })
    }
    showDetail = (invitacion) => {
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this.setState({ refreshing: false });
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
                renderRow={(invitacion) => {
                    return (
                        <InvitacionBox invitacion={invitacion} />
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
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

});