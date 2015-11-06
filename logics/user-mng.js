'use strict';
const agent = require('superagent-promise')(require('superagent'), Promise);

import React from 'react-native';
import * as urls from '../config/config';
const {
  AsyncStorage
} = React;

const skey_local_user = 'user@key';

let userMng = {
  checkIsLogin: function() {
    return this.uid !== '';
  },

  getCurrUserId: function() {
    return this.uid;
  },

  login1: function(userName, userPwd, callback) {
    let self = this;
    AsyncStorage.getItem(skey_local_user).then(function(localUser) {
      if (localUser) {
        localUser = JSON.parse(localUser);
        if ((localUser.name === userName) && (localUser.pwd === userPwd)) {
          self.uid = localUser.id;
          return Promise.reject('succ');
        }
      }
      return agent
       .post(urls.url_user_login)
       .send(JSON.stringify({ userName: userName, userPwd: userPwd }))
       .set('Content-Type', 'application/json')
       .end();
    }).then(function(loginResult) {
      loginResult = loginResult.body.result;
      if (loginResult.substr(0, 4) === 'SUCC') {
        let userID = loginResult.substr(4, 9);
        self.uid = userID;
        return AsyncStorage.setItem(skey_local_user, JSON.stringify({ name: userName, pwd: userPwd, id: userID }));
      }
      else {
        Promise.reject('fail');
      }
    }).then(function() {
      callback(null, self.uid);
    }).catch(function(err) {
      if (err === 'succ') {
        callback(null, self.uid);
      }
      else if (err === 'fail') {
        callback('登录失败', '');
      }
      else callback('服务器错误', '');
    })
  }
}

export default userMng;
