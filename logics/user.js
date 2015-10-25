'use strict';
const agent = require('superagent-promise')(require('superagent'), Promise);

import React from 'react-native';
import { url_user_login } from '../config/config';
const {
  AsyncStorage
} = React;

const skey_local_user = 'user@key';

class User {
  constructor() {
    this.uid = 'default';
  }

  checkIsLogin() {
    return this.uid !== '';
  }

  getCurrUserId() {
    return this.uid;
  }

  async login(userName, userPwd) {
    let localUser = await AsyncStorage.getItem(skey_local_user);
    if (localUser != null) {
      localUser = JSON.parse(localUser);
      if ((localUser.name === userName) && (localUser.pwd === userPwd)) {
        this.uid = localUser.id;
        return true;
      }
    }
    let res = null;
    try
    {
      res = await agent
        .post(url_user_login)
        .send(JSON.stringify({ userName: userName, userPwd: userPwd }))
        .set('Content-Type', 'application/json')
        .end();
    } catch (err) {
      console.log(err);
      return '无法连接服务器或登录失败';
    }
        //check server response
    let loginResult = res.result;
    if (loginResult.substr(0, 4) === 'FAIL') {
      return '账号名或者密码错误';
    }
    //Persistent to local
    let userID = loginResult.substr(4, 9);
    await AsyncStorage.setItem(skey_local_user, JSON.stringify({ name: userName, pwd: userPwd, id: userID }));
    return true;
  }
}

const user = new User();

export default user;
