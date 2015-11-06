'use strict';

const React = require('react-native');
const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TextInput,
  TouchableHighlight,
  AlertIOS,
  AsyncStorage
} = React;
import userMng from '../logics/user-mng';
import WbCollectionView from './WbCollection';

let WelcomeView = React.createClass({
  getInitialState: function() {
    return { userName: 'vex', userPwd: 'bk009107'};
  },

  _onPressLogin: function() {
    let self = this;
    let loginResult = userMng.login1(this.state.userName, this.state.userPwd, function(err, userid) {
      self.props.navigator.push({
          name: 'WbCollectionView',
          component: WbCollectionView
      });
    });
  },

  _onPressRegister: function() {
    AsyncStorage.clear().then(function() {
      AlertIOS.alert( 'Foo Title', 'My Alert Msg', [ {text: 'Foo', onPress: () => console.log('Foo Pressed!')}, {text: 'Bar', onPress: () => console.log('Bar Pressed!')}, ] )
    })
  },

  render: function() {
    let self = this;
    return (
      <View style={styles.container}>
        <Text style={ styles.welcome }>朗播词汇</Text>
        <View style={ styles.inputline }>
          <Text style={ styles.inputtitle }>姓名:</Text>
          <TextInput style={ styles.inputbox } onChangeText={(text) => self.userName = text } placeholder="邮箱，用户名或者手机" value="vex"></TextInput>
        </View>
        <View style={ styles.inputline }>
          <Text style={ styles.inputtitle }>姓名:</Text>
          <TextInput style={ styles.inputbox } onChangeText={(text) => self.userPwd = text } placeholder="6-15位登录密码" value="bk009107" secureTextEntry={ true }></TextInput>
        </View>

        <View style={ styles.actionbar }>
          <TouchableHighlight onPress={this._onPressLogin.bind(this, this.state.userName) } style={ styles.actionbutton }>
            <Text style={ styles.buttontext }>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressRegister} style={ styles.actionbutton }>
            <Text style={ styles.buttontext }>Register</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 30,
  },
  inputline: {
    flexDirection: 'row',
    marginBottom: 20
  },
  inputtitle: {
    alignSelf: 'center',
    marginRight: 5
  },
  inputbox: {
    borderWidth: 1,
    width: 200,
    height: 30,
    borderColor: '#666666'
  },
  actionbar: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around'
  },
  actionbutton: {
    borderWidth: 1,
    width: 100,
    height: 30,
    borderColor: '#666666',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttontext: {
    textAlign: 'center'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default WelcomeView;
