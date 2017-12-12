import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import LectorQR from './screens/LectorQR'
import CodigoQR from './screens/CodigoQR'
import Login from './screens/Login'


const App = StackNavigator({
  login:{
      screen:Login,
  },
  lectorQR: {
    screen: LectorQR,
  },
  codigoQR: {
    screen: CodigoQR,
  },
});

export default App;