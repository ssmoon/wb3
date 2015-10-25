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
import main from './pages/main';

class LangBoWordBook3 extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{name: 'main', component: main}}
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
