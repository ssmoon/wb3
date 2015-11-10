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
  AlertIOS,
  ListView,
} = React;
import userMng from '../logics/user-mng';
import wordCollectionMng from '../logics/word-collection-mng';
import WbCell from '../components/WbItemCell';
import FullScreenLoading from '../components/FullScreenLoading';
import wbCurrentMng from '../logics/wb-current-mng';

import ReciteModeSingle from '../components/ReciteModeSingle'

let P1Recite = React.createClass({
  getInitialState: function() {
     return {
       reciteStep: 1
     }
  },

  componentDidMount: function() {
    let self = this;
    wordCollectionMng.buildDisplayQueue()
  },

  getCurrentWord: function() {
    return wordCollectionMng.getCurrentWord();
  },

  render: function() {
    let reciteView = null;
    switch (this.state.reciteStep) {
      case 1:
        reciteView = <ReciteModeSingle word={ this.getCurrentWord() }></ReciteModeSingle>
        break;

    }

    return (
      <View style={ styles.container }>
        <View style={ styles.headerarea }>
          <TouchableHighlight style={ styles.backaction }>

          </TouchableHighlight>
          <Text style={ styles.headertitle }>
            List { wbCurrentMng.currP1List.L }
          </Text>
          <TouchableHighlight style={ styles.stepswitcher }>
            <Text>步骤</Text>
          </TouchableHighlight>
        </View>
        { reciteView }
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerarea: {
    flexDirection: 'row',
    height: 40
  },
  backaction: {
    width: 60,
    textAlign: 'center'
  },
  stepswitcher: {
    width: 60,
    textAlign: 'center'
  },
  headertitle: {
    flex: 1
  }

});

export default P1Recite;
