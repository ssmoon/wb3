/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} = React;
import Main from './pages/Main';

class LangBoWordBook3 extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{name: 'Main', component: Main}}
                configureScene={() => {
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
                renderScene={(route, navigator) => {
                    // count the number of func calls
                    console.log(route, navigator);

                    if (route.component) {
                        return React.createElement(route.component, { navigator });
                    }
                }}
             />
        );
    }
}


AppRegistry.registerComponent('LangBoWordBook3', () => LangBoWordBook3);
