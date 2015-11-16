'use strict';

const React = require('react-native');
const {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

const familiarityArr = [ 0, 1, 2, 3, 4 ];

let P2Task = React.createClass({
  render: function() {
    let self = this;
    return (
      <View style={ styles.taskContainer }>
        {
          self.props.parts.map((part) => {
            return (
              <TouchableHighlight onPress={ self.props.selectPartHandler.bind(null, part, 1) } key={ part.f }>
                <View style={ styles.fpart }>
                  <Text style={ styles.parttext }>{part.f}级熟练度: { part.total }个单词</Text>
                </View>
              </TouchableHighlight>
            )
          })
        }
      </View>
    );
  }
});

const styles = StyleSheet.create({
  taskContainer: {
    flex: 1,
    paddingTop: 30
  },
  fpart: {
    width: 250,
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    alignSelf: 'center'
  },
  parttext: {
    fontSize: 20,
  }
});

export default P2Task;
