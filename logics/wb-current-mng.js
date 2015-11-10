'use strict';
const agent = require('superagent-promise')(require('superagent'), Promise);
const RNFS = require('react-native-fs');
import React from 'react-native';
import * as urls from '../config/config';
import * as storageAssetDefine from '../utils/assets';
import wordCollectionMng from './word-collection-mng';
const {
  AsyncStorage
} = React;


//every sub part in main part has the maximum words of 300
const Max_Words_In_SubPart = 300;

let currWordBookMng = {
  currUserWb: null,
  wordTable: null,
  currP1Task: null,
  currP1List: null,
  currP2Part: null,

  ensureSysDataExist: function(wordBookType, callback) {
    let self = this;
    //sys date is stored as txt json file, at DocumentDirectoryPath / sysdb /
    //named sys-wordbooktype.txt
    RNFS.mkdir(storageAssetDefine.getSysDbDir(), true).then(function() {
      return RNFS.stat(storageAssetDefine.getSysDbPath(wordBookType))
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
          return RNFS.writeFile(storageAssetDefine.getSysDbPath(wordBookType), JSON.stringify(wordRoot));
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
    AsyncStorage.getItem(storageAssetDefine.getUserWordBookInfo(wordBookID)).then(function(localWordSet) {
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
              AsyncStorage.setItem(storageAssetDefine.getUserWordListMap(wordBookID, i), JSON.stringify(lists[i]))
            );
          }
          batchSavePromises.push(AsyncStorage.setItem(storageAssetDefine.getUserWordBookInfo(wordBookID), JSON.stringify(remoteWbData.wb)));
          batchSavePromises.push(AsyncStorage.setItem(storageAssetDefine.getUserWordCollection(wordBookID), JSON.stringify(words)));
          batchSavePromises.push(AsyncStorage.setItem(storageAssetDefine.getUserWordSchedule(wordBookID), JSON.stringify(remoteWbData.tasks)));

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
          AsyncStorage.getItem(storageAssetDefine.getUserWordBookInfo(wordBookID)),
          AsyncStorage.getItem(storageAssetDefine.getUserWordCollection(wordBookID))
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
  },

  getFirstUnfinishedTask: function(callback) {
    AsyncStorage.getItem(storageAssetDefine.getUserWordSchedule(this.currUserWb.Id)).then(function(tasks) {
      tasks = JSON.parse(tasks);
      let task = null;
      for (let i = 0; i <= tasks.length - 1; i ++) {
        let hasUnfinished = false;
        for (let j = 0; j <= tasks[i].S.length - 1; j ++) {
          if (tasks[i].S[j].C == 0) {
            hasUnfinished = true;
            break;
          }
        }

        if (hasUnfinished) {
          task = tasks[i];
          break;
        }
      }

      if (!task) {
        task = tasks[tasks.length - 1];
      }

      callback(null, task);
    })
  },

  //the following function not only serves P2 data,
  //but calc realtime 5-level familiarity distribution
  buildP2WordPart: function() {
    let self = this;
    let parts = [
      { total: 0, f: 1, subs: [] },
      { total: 0, f: 2, subs: [] },
      { total: 0, f: 3, subs: [] },
      { total: 0, f: 4, subs: [] },
      { total: 0, f: 5, subs: [] }
    ]; //5 level of word familiarity
    for (let wordId in self.wordTable) {
      if (self.wordTable.hasOwnProperty(wordId)) {
        let word = self.wordTable[wordId];
        let targetPart = parts[word.F];
        targetPart.total++;
        //should create new sub part on the following condition
        if ((targetPart.subs.length ==0) || (targetPart.subs[targetPart.subs.length - 1].length === Max_Words_In_SubPart)) {
          targetPart.subs.push([wordId]);
        }
        //if not ,push the word to the last sub part, regardless of its first letter
        //this is the significant distinction from the PC web version
        //while the pc counterpart is to sort the word by its first letter, and combine the same-first-letter word into one sub part
        else targetPart.subs[targetPart.subs.length - 1].push(wordId);
      }
    }
    return parts;
  },

  //invoked when user clicks a List in P1
  buildWordCollectionFromList: function(task, listId, callback) {
    let self = this;
    //taskId is equals to Task Index of the schedule

    self.currP1Task = task;
    self.currP1Task.S.forEach((list) => {
      if (list.L == listId) {
        self.currP1List = list;
      }
    })
    Promise.all([
      AsyncStorage.getItem(storageAssetDefine.getUserWordListMap(self.currUserWb.Id, listId)),
      RNFS.readFile(storageAssetDefine.getSysDbPath(self.currUserWb.DictType))
    ]).then(function(results) {
      let wordIds = JSON.parse(results[0]);
      let sysWordHash = JSON.parse(results[1]);

      wordCollectionMng.wordCollection = {};
      wordIds.forEach((wordId) => {
        let userWord = self.currUserWb[wordId];
        wordCollectionMng.wordCollection[userWord.W] =
        {
          U: self.currUserWb[wordId],
          S: sysWordHash[wordId]
        }
      })
      callback(null);
    })
  }
}

export default currWordBookMng;
