'use strict';

const React = require('react-native');
const {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;

import * as constants from '../utils/const';

let WordCell = React.createClass({
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={ styles.wordcont }>
              <Text style={ styles.wordproto }>{ this.props.word.S.W }</Text>
              <Text style={ styles.cn }>{ this.props.word.S.CN }</Text>
            </View>
            <Text style={ styles.wordf }>
              { Number(this.props.word.U.F) + 1 }
            </Text>
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  wordcont: {
    flex: 1,
    flexDirection: 'column'
  },
  wordproto: {
    fontSize: 20,
    marginBottom: 8
  },
  cn: {
    fontSize: 16
  },
  wordf: {
    color: '#999999',
    fontSize: 12,
    width: 50,
    textAlign: 'center'
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = WordCell;
