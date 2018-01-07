
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';

import Comment from './Comment'

export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  _keyExtractor = (item, index) => index;

  render() {

    return (
      
      <View></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    paddingTop: 50
  }

});

