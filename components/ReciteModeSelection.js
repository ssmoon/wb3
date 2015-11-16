'use strict';

const React = require('react-native');
const {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  TouchableWithoutFeedback
} = React;

import * as constants from '../utils/const';
import ReciteBottomFSwitcher from './ReciteBottomFSwitcher';

//play: http://7xnw4p.com1.z0.glb.clouddn.com/play.png
//star-full: http://7xnw4p.com1.z0.glb.clouddn.com/star.png
//star-empty: http://7xnw4p.com1.z0.glb.clouddn.com/star1.png
let ReciteModeSelection = React.createClass({
  getInitialState: function() {
    return {
      //choie state represents the four choice's state, including notselected: 0,  correct: 2:  error: 1
      choiceState: '0000'
    }
  },

  _selectChoice: function(index) {
    let word = this.props.context.word;
    if (word.S.C[index] === word.Correct) {
      this.setState({
        choiceState: this.state.choiceState.substr(0, index) + '2' + this.state.choiceState.substr(index + 1)
      })
    }
    else {
      this.setState({
        choiceState: this.state.choiceState.substr(0, index) + '1' + this.state.choiceState.substr(index + 1)
      })
    }
  },

  _goNextWordPressed: function() {
    this.setState({ choiceState: '0000' });
    this.props.goNextWordHandler();
  },

  _goPrevWordPressed: function() {
    this.setState({ choiceState: '0000' });
    this.props.goPrevWordHandler();
  },

  render: function() {
    let word = this.props.context.word;
    let self = this;
    return (
      <View style={ styles.container }>
        <View style={ styles.wordarea }>
          <Text style={ styles.wordproto }>
            { word.S.W }
          </Text>
          <TouchableHighlight style={ styles.playerwrapper }>
            <Image
              source={{uri: 'http://7xnw4p.com1.z0.glb.clouddn.com/play.png'}}
              style={styles.playvoice}
            />
          </TouchableHighlight>
        </View>
        <View style={ styles.symbolarea }>
          <Text style={ styles.wsymbol }>
            { word.S.S }
          </Text>
          <Text style={ styles.timecounter }>

          </Text>
        </View>
        <View style={ styles.choicearea }>
          {
            word.S.C.map((choice, index) => {
              let choiceStyle = styles.choice;
              if (self.state.choiceState[index] === '1')
                choiceStyle = [ styles.choice, styles.choice_error];
              else if (self.state.choiceState[index] === '2')
                choiceStyle = [ styles.choice, styles.choice_correct];
              return (
                <TouchableHighlight onPress={ self._selectChoice.bind(self, index) } key={ index }>
                  <Text style={ choiceStyle }>
                    { choice }
                  </Text>
                </TouchableHighlight>
              )
            })
          }
        </View>
        <ReciteBottomFSwitcher
          word = { this.props.context.word }
          changeFaimliarityHandler={ this.props.changeFaimliarityHandler }
        ></ReciteBottomFSwitcher>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 15,
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  wordarea: {
    height: 50,
    flexDirection: 'row',
  },
  symbolarea: {
    height: 40,
    flexDirection: 'row'
  },
  choicearea: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  choice: {
    height: 30,
    borderWidth: 1,
    paddingLeft: 15,
    fontSize: 18,
    marginBottom: 20
  },
  choice_error: {
    color: 'F00C0C'
  },
  choice_correct: {
    color: '0CF02E'
  },
  wordproto: {
    fontSize: 30,
    fontWeight: 'bold',
    flex: 1,
  },
  playerwrapper: {
  },
  playvoice: {
    width: PixelRatio.getPixelSizeForLayoutSize(15),
    height: PixelRatio.getPixelSizeForLayoutSize(15)
  },
  wsymbol: {
    fontSize: 20,
    flex: 1
  },
  timecounter: {
    width: 60,
    textAlign: 'center'
  }
});

export default ReciteModeSelection;
