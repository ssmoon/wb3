'use strict';

const React = require('react-native');
const {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} = React;


let FullScreenLoading = React.createClass({
  render: function() {
    return (
      <View style={ styles.screenLoader }>
        <ActivityIndicatorIOS animating={ 'true' } color='#FFFFFF' size='large' />
      </View>
    )
  }
});

const styles = StyleSheet.create({
  screenLoader: { opacity: 0.5, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#323232', },
});

export default FullScreenLoading;
