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
  TouchableWithoutFeedback
} = React;

const familiarityArr = [ 0, 1, 2, 3, 4 ];

let ReciteBottomFSwitcher = React.createClass({
  render: function() {
    let word = this.props.word;
    let self = this;
    return (
      <View style={ styles.farea }>
        {
          familiarityArr.map((f) => {
            if (f <= word.U.F) {
              return (
                <TouchableWithoutFeedback onPress={ self.props.changeFaimliarityHandler.bind(null, f) } key={ f }>
                  <Image source={{uri: 'http://7xnw4p.com1.z0.glb.clouddn.com/star.png'}} style={styles.fstar} />
                </TouchableWithoutFeedback>
              )
            }
            else {
              return (
                <TouchableWithoutFeedback  onPress={ self.props.changeFaimliarityHandler.bind(null, f) } key={ f }>
                  <Image source={{uri: 'http://7xnw4p.com1.z0.glb.clouddn.com/star1.png'}} style={styles.fstar} />
                </TouchableWithoutFeedback>
              )
            }
          })
        }
      </View>
    )
  }
});

const styles = StyleSheet.create({
  farea: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 300,
    alignSelf: 'center'
  },
  fstar: {
    width: PixelRatio.getPixelSizeForLayoutSize(20),
    height: PixelRatio.getPixelSizeForLayoutSize(20)
  },
})

export default ReciteBottomFSwitcher;
