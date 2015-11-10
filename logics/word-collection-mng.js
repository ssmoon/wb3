'use strict';
const RNFS = require('react-native-fs');
import React from 'react-native';
import * as constants from '../utils/const';

const {
  AsyncStorage
} = React;

let wordCollectionMng = {
  wordCollection: null,
  wordDisplayQueue: null,
  currIndexInQueue: 0,

  currDisplayMode: null,

  setDisplayMode: function(mode) {
    this.currDisplayMode = mode;
  },

  getDisplayMode: function(mode) {
    return currDisplayMode;
  },

  changeFaimliarity: function() {

  },

  //familiarity level limit affects the final word queue only involving the specified words
  //sort: familiarity, firstletter
  buildDisplayQueue: function(fLevelLimit, sort) {
    fLevelLimit = fLevelLimit || 5;
    sort = sort || constants.WordListSortType_Familiarity;
    this.wordDisplayQueue = [];
    this.wordCollection.forEach((word) => {
      if (word.U.F < fLevelLimit) {
        this.wordDisplayQueue.push(word);
      }
    })
    switch (sort) {
      case constants.WordListSortType_Familiarity: {
        this.wordDisplayQueue.sort(function(x, y) {
          return x.U.F - y.U.F;
        })
        break;
      }
      case constants.WordListSortType_FirstLetter: {
        this.wordDisplayQueue.sort(function(x, y) {
          return x.S.W.charCodeAt(0) - y.S.W.charCodeAt(0);
        })
      }
    }
    this.currIndexInQueue = 0;
  },

  getCurrentWord: function() {
    return this.wordDisplayQueue[this.currIndexInQueue];
  }

}

export default wordCollectionMng;
