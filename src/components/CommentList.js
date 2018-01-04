
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
} from 'react-native';

import Comment from './Comment'
import moment from 'moment';
import 'moment/locale/es';
export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  _keyExtractor = (item, index) => index;
  render() {
    
    return (
      <FlatList
          data={this.props.comments}
          
          renderItem={({item}) => 
            (
                <Comment  text={item.text} user={item.user} 
                avatar={item.photo_url} 
                fecha={moment(new Date(item.createdAt)).fromNow()}/>
            ) 
            }
            keyExtractor={this._keyExtractor}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    paddingTop:50
  }
  
});

