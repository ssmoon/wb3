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
  ScrollView
} = React;

import * as constants from '../utils/const';
//play: http://7xnw4p.com1.z0.glb.clouddn.com/play.png
//star-full: http://7xnw4p.com1.z0.glb.clouddn.com/star.png
//star-empty: http://7xnw4p.com1.z0.glb.clouddn.com/star1.png
let ReciteModeSingle = React.createClass({
  render: function() {
    let word = this.props.word;
    return (
      <View style={ styles.container }>
        <View style={ styles.wordarea }>
          <View style={ styles.wordproto }>
            <Text>{ word.S.W }</Text>
          </View>
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
            234
          </Text>
        </View>
        <View style={ styles.meanarea }>
          { word.S.CN }
        </View>
        <ScrollView style={ styles.dynamicarea }>

        </ScrollView>
        <View style={ styles.farea }>

        </View>
        <View style={ styles.navarea }>

        </View>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 15
  },
  wordarea: {
    height: 40,
    flexDirection: 'row'
  },
  symbolarea: {
    height: 30,
    flexDirection: 'row'
  },
  meanarea: {
    height: 30
  },
  dynamicarea: {
    flex: 1
  },
  farea: {
    height: 60
  },
  navarea: {
    height: 40
  },
  wordproto: {

  }
});

export default ReciteModeSingle;
