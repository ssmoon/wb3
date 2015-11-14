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
  ScrollView,
  TouchableWithoutFeedback
} = React;

import * as constants from '../utils/const';
import ReciteBottomNavigator from './ReciteBottomNavigator';
import ReciteBottomFSwitcher from './ReciteBottomFSwitcher';

//play: http://7xnw4p.com1.z0.glb.clouddn.com/play.png
//star-full: http://7xnw4p.com1.z0.glb.clouddn.com/star.png
//star-empty: http://7xnw4p.com1.z0.glb.clouddn.com/star1.png
let ReciteModeSingle = React.createClass({
  render: function() {
    let word = this.props.context.word;
    let self = this;
    //例句
    let additionalInfo = <ScrollView style={ styles.dynamicarea }></ScrollView>;
    if (this.props.reciteStep === 4) {
      additionalInfo = (
         <ScrollView style={ styles.dynamicarea }>
           <Text numberOfLines={ 3 }>{ word.S.SEN }</Text>
           <Text numberOfLines={ 3 }>{ word.S.SCN }</Text>
         </ScrollView>
      );
    }


    return (
      <View style={ styles.container }>
        <View style={ styles.wordarea }>
          <Text style={ styles.wordproto }>
            { word.S.W }
          </Text>
          <TouchableHighlight style={ styles.playerwrapper }>
            <Image
              source={{uri: 'http://7xnw4p.com1.z0.glb.clouddn.com/play.png'}}
              style={styles.playvoice}
            />
          </TouchableHighlight>
        </View>
        <View style={ styles.symbolarea }>
          <Text style={ styles.wsymbol }>
            { word.S.S }
          </Text>
          <Text style={ styles.timecounter }>

          </Text>
        </View>
        <Text style={ styles.meanarea }>
          { word.S.CN }
        </Text>
        { additionalInfo }
        <ReciteBottomFSwitcher
          word={ this.props.context.word }
          changeFaimliarityHandler={ this.props.changeFaimliarityHandler }
        ></ReciteBottomFSwitcher>
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
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 15,
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  wordarea: {
    height: 50,
    flexDirection: 'row',
  },
  symbolarea: {
    height: 40,
    flexDirection: 'row'
  },
  meanarea: {
    height: 40,
    fontSize: 20
  },
  dynamicarea: {
    flex: 1
  },

  wordproto: {
    fontSize: 30,
    fontWeight: 'bold',
    flex: 1,
  },
  playerwrapper: {
  },
  playvoice: {
    width: PixelRatio.getPixelSizeForLayoutSize(15),
    height: PixelRatio.getPixelSizeForLayoutSize(15)
  },
  wsymbol: {
    fontSize: 20,
    flex: 1
  },
  timecounter: {
    width: 60,
    textAlign: 'center'
  },

});

export default ReciteModeSingle;
