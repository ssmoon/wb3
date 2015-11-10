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
import wbCollectionMng from '../logics/wb-collection-mng';
import WbCell from '../components/WbItemCell';
import FullScreenLoading from '../components/FullScreenLoading';
import wbCurrentMng from '../logics/wb-current-mng';
import WbPreface from './WbPreface';

let WbCollectionView = React.createClass({
  getInitialState: function() {
     return {
       dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
       }),
     }
  },

  componentDidMount: function() {
    let self = this;
    this.setState({ isLoading: true });
    wbCollectionMng.fetchUserWordBooks(userMng.getCurrUserId(), function(err, wbCollection) {
      self.setState({
        dataSource: self.getDataSource(wbCollection),
        isLoading: false,
      });
    })
  },

  getDataSource: function(wbCollection) {
    return this.state.dataSource.cloneWithRows(wbCollection);
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

  renderRow: function(wb, sectionID, rowID, highlightRowFunc) {
    return (
      <WbCell
        key={wb.WordBookID}
        onSelect={() => this.selectWordBook(wb)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        wb={wb}
      />
    );
  },

  selectWordBook: function(wb) {
    let self = this;
    self.setState({ isLoading: true });
    wbCurrentMng.initWordBookData(wb, function() {
      self.setState({ isLoading: false });
      self.props.navigator.push({
          name: 'WbPreface',
          component: WbPreface
      });
    })
  },

  render: function() {
    let userID = userMng.getCurrUserId();
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
       { this.state.isLoading ? <FullScreenLoading></FullScreenLoading> : <View></View> }
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

export default WbCollectionView;
