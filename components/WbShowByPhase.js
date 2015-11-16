'use strict';

const React = require('react-native');
const {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} = React;
import DailyTask from './DailyTask';
import P2Task from './P2Task';

let WbShowByPhase = React.createClass({
  render: function() {
    let wb = this.props.wb;
    if (wb.CurrStatus <= 11) {
      return (
        <DailyTask selectListHandler={ this.props.selectListHandler } task={ this.props.task }></DailyTask>
      )
    }
    else {
      return (
        <P2Task selectPartHandler={ this.props.selectPartHandler } parts={ this.props.parts }></P2Task>
      )
    }
  }

});

const styles = StyleSheet.create({
  screenLoader: { opacity: 0.5, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#323232', },
});

export default WbShowByPhase;
