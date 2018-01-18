import React from 'react';
import {
    Platform,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableHighlight,
    View,
} from 'react-native';

export default Boton = (props) => (
    Platform.OS === 'android' ?
        <TouchableNativeFeedback onPress={props.onPress}>
            <View style={[{ backgroundColor: '#FFF', padding: 20 },props.styleBoton]}>
                <Text style={props.styleText}>{props.text}</Text>
            </View>
        </TouchableNativeFeedback>
        :
        <TouchableHighlight onPress={props.onPress} underlayColor="#FFF">
             <View style={[{ backgroundColor: '#FFF', padding: 20 },props.styleBoton]}>
                <Text style={props.styleText}>{props.text}</Text>
            </View>
        </TouchableHighlight>
);
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fcfcfc',
        flexDirection: 'row', elevation: 1.5,
        height: 50, alignItems: 'center', justifyContent: 'center',
        ...Platform.select({
            ios: {
                borderBottomWidth: 0.5, marginTop: 20, borderColor: '#bdc3c7',
            },
        }),
    },

});