'use strict';

const React = require('react-native');
const {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

import P1Recite from '../pages/P1Recite';
import wbCurrentMng from '../logics/wb-current-mng';

let DailyTask = React.createClass({
  _onSelectList: function(task, listId) {
    wbCurrentMng.buildWordCollectionFromList(task, listId, function() {
      self.props.navigator.push({
          name: 'P1Recite',
          component: P1Recite
      });
    })
  },

  render: function() {
    let self = this;
    let newLists = [];
    let reviewLists = [];
    this.props.task.S.forEach((list) => {
      if (list.R == 1) {
        newLists.push(list);
      }
      else reviewLists.push(list);
    })

    let newListSection = <View></View>;
    if (newLists.length > 0) {
      newListSection = (
        <View>
          <Text style={ styles.listtitle }>新背的单元</Text>
          <View style={ styles.listContainer }>
            {newLists.map((list) => {
              return (
                <TouchableHighlight onPress={self._onSelectList.bind(this, self.props.task, list.L)} key={ list.L }>
                  <View style={ styles.listitem }>
                    <View style={ styles.listidx }>
                      <Text>List { list.L }</Text>
                    </View>
                    <Text style={ list.C == 1 ? styles.finished : styles.unfinished }>
                      { list.C == 1 ? '已完成' : '未完成' }
                    </Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        </View>
      )
    }

    let reviewListSection = <View></View>;
    if (reviewLists.length > 0) {
      reviewListSection = (
        <View>
          <Text style={ styles.listtitle }>复习的单元</Text>
          <View style={ styles.listContainer }>
            {reviewLists.map((list) => {
              return (
                <TouchableHighlight onPress={self._onSelectList.bind(this, self.props.task, list.L)} key={ list.L }>
                  <View style={ styles.listitem }>
                    <View style={ styles.listidx }>
                      <Text>List { list.L }</Text>
                    </View>
                    <Text style={ list.C == 1 ? styles.finished : styles.unfinished }>
                      { list.C == 1 ? '已完成' : '未完成' }
                    </Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
        </View>
      )
    }

    return (
      <View style={ styles.taskContainer }>

        { newListSection }
        { reviewListSection }

      </View>
    );
  }
});

const styles = StyleSheet.create({
  taskContainer: {
    flex: 1,
    paddingTop: 30
  },
  listContainer: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  listtitle: {
    marginLeft: 20,
    marginBottom: 15
  },
  listitem: {
    width: 80,
    height: 50
  },
  listidx: {
    marginBottom: 10
  },
  finished: {
    color: 'green'
  },
  unfinished: {
    color: 'red'
  }
});

export default DailyTask;
