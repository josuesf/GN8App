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
    <View style={{backgroundColor:'#fcfcfc',flexDirection:'row',elevation:1.5,height:50,alignItems:'center',justifyContent:'center'}} >
        {banner=="GN8" && <Text style={{fontWeight:'900',fontSize:20,color:'#831DA2'}}>G</Text>}
        {banner=="GN8" && <Text style={{fontWeight:'900',fontSize:20,color:'#831DA2'}}>N</Text>}
        {banner=="GN8" && <Text style={{fontWeight:'900',fontSize:20,color:'#831DA2'}}>8</Text>}
        {banner!="GN8" && <Text style={{fontWeight:'900',fontSize:18}}>{banner}</Text>}
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