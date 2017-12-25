import React from 'react';
import {
    Button,
    Platform,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { SafeAreaView, TabNavigator } from 'react-navigation';
const {width}=Dimensions.get('window')

const toolbar = ({ navigation, banner }) => (
    <View style={[styles.container]} >
        {banner=="GN8" && <Text style={{fontWeight:'900',fontSize:20,color:'#831DA2'}}>G</Text>}
        {banner=="GN8" && <Text style={{fontWeight:'900',fontSize:20,color:'#831DA2'}}>N</Text>}
        {banner=="GN8" && <Text style={{fontWeight:'900',fontSize:20,color:'#831DA2'}}>8</Text>}
        {banner!="GN8" && <Text style={{fontWeight:'900',fontSize:18,color:'#757575'}}>{banner}</Text>}
    </View>
);
const styles = StyleSheet.create({
    container: {
        width,backgroundColor:'#fcfcfc',
        flexDirection:'row',elevation:1.5,
        height:50,alignItems:'center',justifyContent:'center',
        ...Platform.select({
            ios: {
                borderBottomWidth:0.5,marginTop:10,borderColor:'#bdc3c7',
            },
          }),
    },
    
});

export default toolbar;