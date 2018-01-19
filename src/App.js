import React from 'react';
import { View, Text, Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import LectorQR from './screens/LectorQR'
import CodigoQR from './screens/CodigoQR'
import Login from './screens/Login'
import RegistroPrincipal from './screens/RegistroPrincipal'
import Home from './screens/Home'
import Perfil from './screens/Perfil'
import Buscar from './screens/Buscar'
import Invitaciones from './screens/Invitaciones'
import Registro from './screens/Registro'
import RegistroDetalle from './screens/RegistroDetalle'
import Splash from './screens/Splash'
import EditarPerfil from './screens/EditarPerfil';
import EditarPerfilEmpresa from './screens/EditarPerfilEmpresa'
import RegistroEmpresa from './screens/RegistroEmpresa';
import Comentarios from './screens/Comentarios'
import DieronLike from './screens/DieronLike';
import NuevoPost from './screens/NuevoPost';
import VistaPerfil from './screens/VistaPerfil';
import Mapa from './screens/Mapa'
const Main = TabNavigator({
  home: {
    screen: Home,
    path: 'homeTab',
  },
  buscador: {
    screen: Buscar,
    path: 'buscar',
  },
  invitaciones: {
    screen: Invitaciones,
    path: 'invitaciones',
  },
  perfil: {
    screen: Perfil,
    path: 'perfil',
  }
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled:false,
    tabBarOptions: {
      activeTintColor: '#9b59b6',
      labelStyle: {
        fontSize: 10,
      },
      style: {
        backgroundColor: '#fcfcfc',
      },
      showIcon: true,
      showLabel: true,
      indicatorStyle: { backgroundColor: 'transparent' }
    },
    lazy:true,

  });

const App = StackNavigator(
  {
    splash: {
      screen: Splash,
    },
    registroMain: {
      screen: RegistroPrincipal,
    },
    login: {
      screen: Login,
    },
    main: {
      screen: Main,
    },
    registro: {
      screen: Registro,
    },
    registrodetalle: {
      screen: RegistroDetalle,
    },
    editPerfil:{
      screen: EditarPerfil
    },
    editPerfilEmpresa:{
      screen: EditarPerfilEmpresa,
    },
    registroEmpresa:{
      screen:RegistroEmpresa
    },
    comentarios:{
      screen:Comentarios
    },
    dieronLike:{
      screen:DieronLike
    },
    nuevoPost:{
      screen:NuevoPost
    },
    lectorQR:{
      screen:LectorQR
    },
    vistaPerfil:{
      screen:VistaPerfil
    },
    mapa:{
      screen:Mapa
    }
  },
  {
    initialRouteName: 'splash',
    //headerMode: 'none',
    /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  });
  


export default App;