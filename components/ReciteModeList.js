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

import * as constants from '../utils/const';
import WordCell from '../components/WordCell';
import ReciteBottomNavigator from './ReciteBottomNavigator';

const familiarityArr = [ 0, 1, 2, 3, 4 ];
//play: http://7xnw4p.com1.z0.glb.clouddn.com/play.png
//star-full: http://7xnw4p.com1.z0.glb.clouddn.com/star.png
//star-empty: http://7xnw4p.com1.z0.glb.clouddn.com/star1.png
let ReciteModeSelection = React.createClass({
  getInitialState: function() {
     return {
       dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
       }),
     }
  },

  componentDidMount: function() {
    let self = this;
    this.setState({
      dataSource: self.getDataSource(this.props.context)
    });
  },

  getDataSource: function(wordCollection) {
    return this.state.dataSource.cloneWithRows(wordCollection);
  },

  renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },

  renderRow: function(word, sectionID, rowID, highlightRowFunc) {
    return (
      <WordCell
        key={word.S.Id}
        onSelect={() => this.selectWord(word)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        word={word}
      />
    );
  },

  selectWord: function(word) {

  },

  render: function() {
    let self = this;

    return (
      <View style={styles.container}>
        <ListView
           ref="listview"
           renderSeparator={this.renderSeparator}
           dataSource={this.state.dataSource}
           renderRow={this.renderRow}
           automaticallyAdjustContentInsets={false}
           keyboardDismissMode="on-drag"
           keyboardShouldPersistTaps={true}
           showsVerticalScrollIndicator={false}
         />
         <ReciteBottomNavigator
           goNextWordHandler={ this.props.goNextWordHandler }
           goPrevWordHandler={ this.props.goPrevWordHandler }
           goNextStepHandler={ this.props.goNextStepHandler }
           goPrevStepHandler={ this.props.goPrevWordHandler }
           finishListHandler={ this.props.finishListHandler }
           reciteStep={ this.props.reciteStep }
           context={ this.props.context }>
         ></ReciteBottomNavigator>
      </View>

    );
  }
})

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },

});

export default ReciteModeSelection;
