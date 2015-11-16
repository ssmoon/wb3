'use strict';

const React = require('react-native');
const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  PixelRatio,
  TouchableHighlight,
  ListView,
} = React;
import userMng from '../logics/user-mng';
import wordCollectionMng from '../logics/word-collection-mng';
import WbCell from '../components/WbItemCell';
import FullScreenLoading from '../components/FullScreenLoading';
import wbCurrentMng from '../logics/wb-current-mng';

import ReciteModeSingle from '../components/ReciteModeSingle'
import ReciteModeSelection from '../components/ReciteModeSelection'
import ReciteModeList from '../components/ReciteModeList'
import ReciteBottomP2Navigator from '../components/ReciteBottomP2Navigator'

let P2Recite = React.createClass({
  getInitialState: function() {
     return {
       reciteStep: 1
     }
  },

  componentWillMount: function() {
    this.initWithStep(1);
  },

  _goNextWordPressed: function() {
    wordCollectionMng.tryGoNextWord();
    this.setCurrentWord();
  },

  _goPrevWordPressed: function() {
    wordCollectionMng.tryGoPrevWord();
    this.setCurrentWord();
  },

  initWithStep: function(step) {
    wordCollectionMng.buildDisplayQueue(5);
    this.setState({
       reciteStep: step,
       context: wordCollectionMng.getCurrentContext()
     });
  },

  _goNextStepPressed: function() {
    this.initWithStep(this.state.reciteStep + 1);
  },

  _goPrevStepPressed: function() {
    this.initWithStep(this.state.reciteStep - 1);
  },

  _finishPartPressed: function() {
    this.props.navigator.pop();
  },

  setCurrentWord: function() {
    this.setState(
      {
        context: wordCollectionMng.getCurrentContext()
      }
    )
  },

  _goBackPressed: function() {
    this.props.navigator.pop();
  },

  _changeFamiliarityPressed: function(familiarity) {
    wordCollectionMng.changeFaimliarity(familiarity);
    this.setCurrentWord();
  },

  render: function() {
    let reciteView = null;
    switch (this.state.reciteStep) {
      case 2: {
        reciteView = (
          <ReciteModeList
            changeFaimliarityHandler={ this._changeFamiliarityPressed }
            context={ wordCollectionMng.getAllWords() }
          ></ReciteModeList>
        );
        break;
      }
      case 1: {
        reciteView = (
          <ReciteModeSingle
            changeFaimliarityHandler={ this._changeFamiliarityPressed }
            context={ this.state.context }>
          </ReciteModeSingle>
        );
        break;
      }
      case 3: {
        reciteView = (
          <ReciteModeSelection
            changeFaimliarityHandler={ this._changeFamiliarityPressed }
            context={ this.state.context }>
          </ReciteModeSelection>
        );
        break;
      }
    }

    return (
      <View style={ styles.container }>
        <View style={ styles.headerarea }>
          <TouchableHighlight style={ styles.backaction } onPress={ this._goBackPressed }>
            <Text>Back</Text>
          </TouchableHighlight>
          <Text style={ styles.headertitle }>
            熟练度 { wbCurrentMng.currP2Part.f }
          </Text>
          <TouchableHighlight style={ styles.stepswitcher }>
            <Text>步骤</Text>
          </TouchableHighlight>
        </View>
        { reciteView }
        <ReciteBottomP2Navigator
          goNextWordHandler={ this._goNextWordPressed }
          goPrevWordHandler={ this._goPrevWordPressed }
          goNextStepHandler={ this._goNextStepPressed }
          goPrevStepHandler={ this._goPrevStepPressed }
          finishPartHandler={ this._finishPartPressed }
          reciteStep={ this.state.reciteStep }
          context={ this.state.context }>
        </ReciteBottomP2Navigator>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  headerarea: {
    flexDirection: 'row',
    height: 30,
    borderBottomWidth: 1
  },
  backaction: {
    width: 60,
  },
  stepswitcher: {
    width: 60,
  },
  headertitle: {
    flex: 1,
    textAlign: 'center'
  }

});

export default P2Recite;
