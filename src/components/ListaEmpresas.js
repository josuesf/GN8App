import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    TouchableOpacity,
    AsyncStorage,
    RefreshControl,
} from 'react-native';
import EmpresaBox from './EmpresaBox'
export default class ListaEmpresas extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            refreshing:false,
        }
    }
    componentDidMount() {

        this.updateDataSource(this.props.empresas)
    }
    componentWillReceiveProps(newProps) {
        if (newProps.empresas !== this.props.empresas) {
            this.updateDataSource(newProps.empresas)
        }
    }
    updateDataSource = data => {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(data) })
    }
    showDetail = (empresa) => {
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this.setState({ refreshing: false });
    }
    render() {

        return (
            <ListView contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(empresa) => {
                    return (
                        <EmpresaBox empresa={empresa} style={styles.item} />
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