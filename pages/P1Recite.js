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
import ReciteBottomP1Navigator from '../components/ReciteBottomP1Navigator'

let P1Recite = React.createClass({
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
    switch (step) {
      case 1: {
        wordCollectionMng.buildDisplayQueue(5);
        break;
      }
      case 2: {
        wordCollectionMng.buildDisplayQueue(3);
        break;
      }
      case 3: {
        wordCollectionMng.buildDisplayQueue(3);
        break;
      }
      case 4: {
        wordCollectionMng.buildDisplayQueue(3);
        break;
      }
      case 5: {
        wordCollectionMng.buildDisplayQueue(5);
        break;
      }
      case 6: {
        wordCollectionMng.buildDisplayQueue(3);
        break;
      }
    }
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

  _finishListPressed: function() {
    let self = this;
    wbCurrentMng.markListComplete(() => {
      let routes = self.props.navigator.getCurrentRoutes()
      if (routes[routes.length - 1].callback)
        routes[routes.length - 1].callback();
      self.props.navigator.pop();
    })
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
      case 5: {
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
      case 2: {
        reciteView = (
          <ReciteModeSingle
            changeFaimliarityHandler={ this._changeFamiliarityPressed }
            context={ this.state.context }>
          </ReciteModeSingle>
        );
        break;
      }
      case 4: {
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
      case 6: {
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
            List { wbCurrentMng.currP1List.L }
          </Text>
          <TouchableHighlight style={ styles.stepswitcher }>
            <Text>步骤</Text>
          </TouchableHighlight>
        </View>
        { reciteView }
        <ReciteBottomP1Navigator
          goNextWordHandler={ this._goNextWordPressed }
          goPrevWordHandler={ this._goPrevWordPressed }
          goNextStepHandler={ this._goNextStepPressed }
          goPrevStepHandler={ this._goPrevStepPressed }
          finishListHandler={ this._finishListPressed }
          reciteStep={ this.state.reciteStep }
          context={ this.state.context }>
        </ReciteBottomP1Navigator>
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

export default P1Recite;
