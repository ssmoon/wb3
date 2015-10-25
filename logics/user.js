'use strict';
const agent = require('superagent-promise')(require('superagent'), Promise);

import React from 'react-native';
import { url_user_login } from '../config/config';
import co from 'co';
const {
  AsyncStorage
} = React;

const skey_local_user = 'user@key';

let User = {


  checkIsLogin: function() {
    return this.uid !== '';
  },

  getCurrUserId: function() {
    return this.uid;
  },

  login1: function(userName, userPwd) {
    AsyncStorage.getItem(skey_local_user).then(function(localUser) {
      if (localUser) {
        localUser = JSON.parse(localUser);
        if ((localUser.name === userName) && (localUser.pwd === userPwd)) {
          this.uid = localUser.id;
          return true;
        }
      }
    })
     agent
      .post(url_user_login)
      .send(JSON.stringify({ userName: userName, userPwd: userPwd }))
      .set('Content-Type', 'application/json')
      .end().then(function() {
        let userID = loginResult.substr(4, 9);
        return AsyncStorage.setItem(skey_local_user, JSON.stringify({ name: userName, pwd: userPwd, id: userID }));
      }).then(function() {
        return '1';
      })

  },

  login: function(userName, userPwd) {
    co(function* () {
      debugger;
      let localUser = yield AsyncStorage.getItem(skey_local_user);

      if (localUser != null) {
        localUser = JSON.parse(localUser);
        if ((localUser.name === userName) && (localUser.pwd === userPwd)) {
          this.uid = localUser.id;
          return true;
        }
      }
      //validate user by server response
      let res = yield agent
        .post(url_user_login)
        .send(JSON.stringify({ userName: userName, userPwd: userPwd }))
        .set('Content-Type', 'application/json')
        .end();

      let loginResult = res.result;
      if (loginResult.substr(0, 4) === 'FAIL') {
        return '账号名或者密码错误';
      }
      //Persistent to local
      let userID = loginResult.substr(4, 9);
      yield AsyncStorage.setItem(skey_local_user, JSON.stringify({ name: userName, pwd: userPwd, id: userID }));
      return userID;
    }).then(function (val) {
      return val;
    }, function (err) {
      console.error(err.stack);
      console.log(err);
      return '无法连接服务器或登录失败';
    });
  }
}

export default User;
