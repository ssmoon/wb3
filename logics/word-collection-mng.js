'use strict';
const RNFS = require('react-native-fs');
import React from 'react-native';
import * as constants from '../utils/const';
import * as storageAssetDefine from '../utils/assets';

const {
  AsyncStorage
} = React;

let wordCollectionMng = {
  wordCollection: null,
  wordDisplayQueue: null,
  currIndexInQueue: 0,
  currWordBookID: null,
  modifiedWordRoot: {},

  initNewCollection: function(wordBookID, wordCollection) {
    let self = this;
    this.currWordBookID = wordBookID;
    this.wordCollection = wordCollection;
    this.currIndexInQueue = 0;
    this.wordDisplayQueue = [];
    this.modifiedWordRoot = {};
  },

  setDisplayMode: function(mode) {
    this.currDisplayMode = mode;
  },

  getDisplayMode: function(mode) {
    return currDisplayMode;
  },

  shuffleArray: function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  },

  //familiarity level limit affects the final word queue only involving the specified words
  //sort: familiarity, firstletter
  buildDisplayQueue: function(fLevelLimit, sort) {
    let self = this;
    fLevelLimit = fLevelLimit || 5;
    sort = sort || constants.WordListSortType_Familiarity;
    this.wordDisplayQueue = [];
    this.wordCollection.forEach((word) => {
      if (word.U.F < fLevelLimit) {
        self.wordDisplayQueue.push(word);
        word.S.C = self.shuffleArray(word.S.C);
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

  getAllWords: function() {
    return this.wordDisplayQueue;
  },

  getCurrentContext: function() {
    return {
      word: this.wordDisplayQueue[this.currIndexInQueue],
      index: this.currIndexInQueue,
      total: this.wordDisplayQueue.length,
      isFirst: this.currIndexInQueue === 0,
      isLast: this.currIndexInQueue === (this.wordDisplayQueue.length - 1)
    }
  },

  tryGoNextWord: function() {
    if (this.currIndexInQueue < this.wordDisplayQueue.length - 1) {
      this.currIndexInQueue++;
    }
  },

  tryGoPrevWord: function() {
    if (this.currIndexInQueue > 0) {
      this.currIndexInQueue--;
    }
  },

  //wordIndex would be only used in Step 5,
  //otherwise, use currIndexInQueue
  changeFaimliarity: function(familiarity, wordIndex) {
    wordIndex = wordIndex || this.currIndexInQueue;
    this.wordDisplayQueue[wordIndex].U.F = familiarity;
    let self = this;
    this.modifiedWordRoot[this.wordDisplayQueue[wordIndex].U.W] = this.wordDisplayQueue[wordIndex].U;
    AsyncStorage.setItem(storageAssetDefine.getUserModifiedWord(this.currWordBookID), JSON.stringify(this.modifiedWordRoot)).then(() => {
      console.log('persist modified word done: ' + JSON.stringify(self.modifiedWordRoot));
    });
  },

  changeNote: function(note, wordIndex) {
    wordIndex = wordIndex || this.currIndexInQueue;
    this.wordDisplayQueue[wordIndex].U.N = note;
    let self = this;
    this.modifiedWordRoot[this.wordDisplayQueue[wordIndex].U.W] = this.wordDisplayQueue[wordIndex].U;
    AsyncStorage.setItem(storageAssetDefine.getUserModifiedWord(this.currWordBookID), JSON.stringify(this.modifiedWordRoot)).then(() => {
      console.log('persist modified word done: ' + JSON.stringify(self.modifiedWordRoot));
    });
  },

  releaseMemory: function() {
    this.wordDisplayQueue = [];
    this.wordCollection = [];
    this.modifiedWordRoot = {};
  }

}

export default wordCollectionMng;
