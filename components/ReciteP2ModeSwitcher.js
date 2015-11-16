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
  ListView,
  TouchableWithoutFeedback
} = React;

let ReciteBottomNavigator = React.createClass({
  render: function() {
    return (
      <View style={ styles.navarea }>
        <TouchableHighlight onPress={ this.props.goPrevStepHandler }>
          <Text style={ styles.mode }>上一轮</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ this.props.goPrevStepHandler }>
          <Text style={ styles.mode }>上一轮</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ this.props.goPrevStepHandler }>
          <Text style={ styles.mode }>上一轮</Text>
        </TouchableHighlight>
      </View>
    )

  }
});

const styles = StyleSheet.create({
  navarea: {
    height: 40,
    flexDirection: 'row'
  },
  mode: {
    flex: 1,
    height: 40,
    fontSize: 22
  },
})

export default ReciteBottomNavigator;
