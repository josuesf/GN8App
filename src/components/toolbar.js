import React from 'react';
import {
    Button,
    Platform,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView, TabNavigator } from 'react-navigation';
const {width}=Dimensions.get('window')

const toolbar = ({ navigation, banner }) => (
    <View style={[styles.container]} >
        {banner=="GN8" && <Image style={{height:38,width:38}} resizeMode='stretch' source={require('../assets/img/logo.png')}/>}
        
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