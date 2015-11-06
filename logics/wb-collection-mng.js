'use strict';
const agent = require('superagent-promise')(require('superagent'), Promise);

import React from 'react-native';
import * as urls from '../config/config';
const {
  AsyncStorage
} = React;

const skey_wb_collection = 'wb@mycollection@';

var wbCollectionMng = {
  fetchUserWordBooks: function(userID, callback) {
    let wbCollection = null;
    AsyncStorage.getItem(skey_wb_collection + userID).then(function(cachedwbCollection) {
      if (cachedwbCollection) {
        wbCollection = JSON.parse(cachedwbCollection);
        return Promise.reject('succ');
      }
      return agent
       .post(urls.url_userwb_mylist)
       .send(JSON.stringify({ userID: userID }))
       .set('Content-Type', 'application/json')
       .end();
    }).then(function(remotewbCollection) {
      wbCollection = remotewbCollection.body;
      if (wbCollection.length > 0) {
        return AsyncStorage.setItem(skey_wb_collection + userID, JSON.stringify(wbCollection));
      }
      else Promise.reject('succ');
    }).then(function() {
      callback(null, wbCollection);
    }).catch(function(err) {
      if (err === 'succ') {
        callback(null, wbCollection)
      }
      else {
        console.log(err);
        callback(err, null);
      }
    })
  },

  refreshWbCollection: function(userID) {
    agent
       .post(urls.url_userwb_mylist)
       .send(JSON.stringify({ userID: userID }))
       .set('Content-Type', 'application/json')
       .end().
    then(function(remotewbCollection) {
      wbCollection = remotewbCollection.body;
      if (wbCollection.length > 0) {
        return AsyncStorage.setItem(skey_wb_collection + userID, JSON.stringify(wbCollection));
      }
    }).catch(function(err) {
      console.log(err);
    })
  }
}

export default wbCollectionMng;
