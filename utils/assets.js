'use strict';
const RNFS = require('react-native-fs');
const skey_userwb_prefix = 'usr#';
const storageAssetDefine = {
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
  },



  getToSyncWord: function(wordBookID) {
    return 'sync#' + wordBookID + '#word';
  },

  getToSyncList: function(wordBookID) {
    return 'sync#' + wordBookID + '#list';
  },



  getSysDbDir: function() {
    return RNFS.DocumentDirectoryPath + '/sysdb/';
  },

  getSysDbPath: function(wordBookType) {
    return RNFS.DocumentDirectoryPath + '/sysdb/sys-' + wordBookType + '.txt';
  }
}

export default storageAssetDefine;
