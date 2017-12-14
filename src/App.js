import React from 'react';
import { View, Text,Platform } from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';

import LectorQR from './screens/LectorQR'
import CodigoQR from './screens/CodigoQR'
import Login from './screens/Login'
import Home from './screens/Home'
import Perfil from './screens/Perfil'
import Buscar from './screens/Buscar'
import Invitaciones from './screens/Invitaciones'

const Main = TabNavigator({
  home: {
    screen: Home,
    path: '',
  },
  buscador:{
    screen: Buscar,
    path:'buscar'
  },
  invitaciones: {
    screen: Invitaciones,
    path: 'invitaciones',
  },
  /*lectorQR: {
    screen: LectorQR,
    path: 'lector',
  }, */ 
  perfil:{
    screen: Perfil,
    path: 'perfil',
  }
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#616161',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: '#fcfcfc',
      elevation:5,
    },
    showIcon:true,
    showLabel:false,
    indicatorStyle:{backgroundColor:'transparent'}
  },
  
});
//Validar en base de datos si es que este usuario esta logueado para establecer
var index='main'
if( 4==4){
  index='login'
}

const App = StackNavigator(
  {
    login: {
      screen: Login,
    },
    main: {
      screen: Main,
    },
  },
  {
    initialRouteName: index,
    //headerMode: 'none',
    /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  });
  

export default App;