import React from 'react';
import {
    Button,
    Platform,
    ScrollView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { SafeAreaView, TabNavigator } from 'react-navigation';

const toolbar = ({ navigation, banner }) => (
    <View style={{backgroundColor:'#fcfcfc',elevation:1.5,height:50,alignItems:'center',justifyContent:'center'}} >
        <Text style={{fontWeight:'900',fontSize:18}}>{banner}</Text>
    </View>
);
const styles = StyleSheet.create({
    container: {
        
        backgroundColor: '#FFF',
        flexDirection:'row',
        alignItems:'center',
    },
});

export default toolbar;