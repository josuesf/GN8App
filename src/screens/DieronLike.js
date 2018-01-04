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
export default class DieronLike extends Component {
    static navigationOptions = {
        title: 'Les parece genial a...',
        headerTintColor: 'purple',
    };
    constructor() {
        super()

        this.state = {
        }
    }
    _keyExtractor = (item, index) => index;
    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View ref="personas" behavior="padding" style={styles.container}>
                <FlatList
                    data={this.props.navigation.state.params.dieronLike}
                    
                    renderItem={({ item }) =>
                        (
                            item.like && <ListItem
                                roundAvatar
                                avatar={{ uri: item.photo_url }}
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