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

let ReciteBottomP1Navigator = React.createClass({
  render: function() {
    //default for step: 5
    let prevNavigator = (
      <TouchableHighlight style={ styles.navarrow } onPress={ this.props.goPrevStepHandler }>
        <Text style={ styles.navtext1 }>上一轮</Text>
      </TouchableHighlight>
    );
    if (this.props.reciteStep !== 5) {
      if (this.props.context.isFirst) {
        if (this.props.reciteStep === 1) {
          prevNavigator = (
            <View style={ styles.navarrow }></View>
          )
        }
        //else use default
      }
      else {
        prevNavigator = (
          <TouchableHighlight style={ styles.navarrow } onPress={ this.props.goPrevWordHandler }>
            <Text style={ styles.navtext1 }>上一个</Text>
          </TouchableHighlight>
        )
      }
    }

    //default for step: 5
    let nextNavigator = (
      <TouchableHighlight style={ styles.navarrow } onPress={ this.props.goNextStepHandler }>
        <Text style={ styles.navtext1 }>下一轮</Text>
      </TouchableHighlight>
    );
    if (this.props.reciteStep !== 5) {
      if (this.props.context.isLast) {
        if (this.props.reciteStep === 6) {
          nextNavigator = (
            <TouchableHighlight style={ styles.navarrow } onPress={ this.props.finishListHandler }>
              <Text style={ styles.navtext1 }>结束</Text>
            </TouchableHighlight>
          )
        }
        //else use default
      }
      else {
        nextNavigator = (
          <TouchableHighlight style={ styles.navarrow } onPress={ this.props.goNextWordHandler }>
            <Text style={ styles.navtext1 }>下一个</Text>
          </TouchableHighlight>
        )
      }
    }

    let currPosition = <Text style={ styles.navinfo }></Text>;
    if (this.props.reciteStep !== 5) {
      currPosition = (
        <Text style={ styles.navinfo }>
          { this.props.context.index + 1 } / { this.props.context.total }
        </Text>
      )
    }

    return (
      <View style={ styles.navarea }>
        { prevNavigator }
        { currPosition }
        { nextNavigator }
      </View>
    )

  }
});

const styles = StyleSheet.create({
  navarea: {
    height: 40,
    flexDirection: 'row'
  },
  navarrow: {

  },
  navinfo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20
  },
  navtext1: {
    textAlign: 'left'
  },
  navtext2: {
    textAlign: 'right'
  }
})

export default ReciteBottomP1Navigator;
