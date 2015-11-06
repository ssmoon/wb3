'use strict';
const agent = require('superagent-promise')(require('superagent'), Promise);
const RNFS = require('react-native-fs');
import React from 'react-native';
import * as urls from '../config/config';
const {
  AsyncStorage
} = React;

const skey_userwb_prefix = 'usr#';

let localStorageKeyDefine = {
  getUserWordBookInfo: function(wordBookID) {
    return skey_userwb_prefix + wordBookID;
  },

  getUserWordCollection: function(wordBookID) {
    return skey_userwb_prefix + wordBookID + '#word';
  },

  getUserWordSchedule: function(wordBookID) {
    return skey_userwb_prefix + wordBookID + '#schedule';
  },

  getUserWordListMap: function(wordBookID, listID) {
    return skey_userwb_prefix + wordBookID + '#' + listID;
  },

  getUserModifiedWord: function(wordBookID) {
    return skey_userwb_prefix + wordBookID + '#modified';
  }
}

let currWordBookMng = {
  currSysWb: null,
  currUserWb: null,
  wordTable: null,

  getSysDbDir: function() {
    return RNFS.DocumentDirectoryPath + '/sysdb/';
  },

  getSysDbPath: function(wordBookType) {
    return RNFS.DocumentDirectoryPath + '/sysdb/sys-' + wordBookType + '.txt';
  },

  ensureSysDataExist: function(wordBookType, callback) {
    let self = this;
    //sys date is stored as txt json file, at DocumentDirectoryPath / sysdb /
    //named sys-wordbooktype.txt
    RNFS.mkdir(this.getSysDbDir(), true).then(function() {
      return RNFS.stat(self.getSysDbPath(wordBookType))
    }).then(function(statResult) {
      if (statResult.isFile()) {
        callback(null);
      }
      else return Promise.reject('retry');
    }).catch(function(err) {
      //if the file is not existed, load from remote
      if ((err === 'retry') || (err.message && (err.message.indexOf('operation could') >= 0))) {
        agent
         .post(urls.url_syswb_single + wordBookType)
         .set('Content-Type', 'application/json')
         .end().then(function(sysWords) {
            sysWords = sysWords.body;
            let wordRoot = {};
            sysWords.forEach((word) => {
              wordRoot[word.Id] = word;
            })
            return RNFS.writeFile(self.getSysDbPath(wordBookType), JSON.stringify(wordRoot));
         }).then(function() {
           callback(null);
         })
      }
      else {
        console.log(err);
      }
    })
  },

  //this function does 2 things;
  //1: ensure the user data exists in local, if not, load from remote
  //2: load user word data(familiarity, note) to memory, because this data is necessary whatever in P1 or P2
  //the other data, like list-task mapping , list-word mapping will be loaded lazily
  ensureUserDataExist(wordBookID, callback) {
    let self = this;
    AsyncStorage.getItem(localStorageKeyDefine.getUserWordBookInfo(wordBookID)).then(function(localWordSet) {
      if (localWordSet) {
        return Promise.reject('ready');
      }
      else {
        //load from remote
        return agent
         .post(urls.url_userwb_sync)
         .send(JSON.stringify({ wordBookID: wordBookID, lists: [], words: [] }))
         .set('Content-Type', 'application/json')
         .end().then(function(remoteWbData) {
           remoteWbData = remoteWbData.body;
           let lists = {};
           let words = {};
           let maxList = 0;
           //remoteWbData.Tasks will be perisisted to local storage directly
           //the following code will build 2 things
           //1. words object, contains all words info, each word includes familiarity and note, mapped by wordid
           //2, list-word mapping, each list contains every word in it, and the list will be perisisted in the key: wb#{wbid}#{listid}
           remoteWbData.words.forEach((word) => {
             let wordId = word.substr(0, 4).trim();
             let familiarity = word.substr(4, 1);
             let listId = parseInt(word.substr(5, 2));
             let note = word.substr(7);
             if (lists[listId]) {
               lists[listId].push(wordId);
             }
             else {
               lists[listId] = [ wordId ];
             }
             if (maxList < listId) {
               maxList = listId;
             }
             words[wordId] = { W: wordId, F: familiarity, N: note };
           })
           let batchSavePromises = [];
           for (let i = 1; i <= maxList; i ++) {
             batchSavePromises.push(
               AsyncStorage.setItem(localStorageKeyDefine.getUserWordListMap(wordBookID, i), JSON.stringify(lists[i]))
             );
           }
           batchSavePromises.push(AsyncStorage.setItem(localStorageKeyDefine.getUserWordBookInfo(wordBookID), JSON.stringify(remoteWbData.wb)));
           batchSavePromises.push(AsyncStorage.setItem(localStorageKeyDefine.getUserWordCollection(wordBookID), JSON.stringify(words)));
           batchSavePromises.push(AsyncStorage.setItem(localStorageKeyDefine.getUserWordSchedule(wordBookID), JSON.stringify(remoteWbData.tasks)));

           return Promise.all(batchSavePromises);
         }).then(function() {
           return Promise.reject('ready');
         }).catch(function(err) {
           return Promise.reject(err);
         })
      }
    }).catch(function(err) {
      if (err === 'ready') {
        //load word data to memory to build hash table
        //load wordbook info to memory
        Promise.all([
          AsyncStorage.getItem(localStorageKeyDefine.getUserWordBookInfo(wordBookID)),
          AsyncStorage.getItem(localStorageKeyDefine.getUserWordCollection(wordBookID))
        ])
        .then(function(results) {
          self.currUserWb = JSON.parse(results[0]);
          self.wordTable = JSON.parse(results[1]);
          callback(null);
        }).catch(function(e1) {
          console.log(e1);
          callback(e1);
        })
      }
      else {
         console.log(err);
         callback(err);
       }
    })
  },

  initWordBookData: function(wordBookItem, callback) {
    var self = this;
    let sysDataPromise = new Promise((resolve, reject) => {
      self.ensureSysDataExist(wordBookItem.DictType, function(err) {
        if (err) {
          reject(err);
        }
        else resolve();
      })
    })
    let userDataPromise = new Promise((resolve, reject) => {
      self.ensureUserDataExist(wordBookItem.Id, function(err) {
        if (err) {
          reject(err);
        }
        else resolve();
      })
    })
    Promise.all([sysDataPromise, userDataPromise]).then(function() {
      callback(null);
    }).catch(function(err) {
      callback(err);
    })
  }
}

export default currWordBookMng;
