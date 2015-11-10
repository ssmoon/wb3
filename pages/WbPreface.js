const React = require('react-native');
const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  PixelRatio,
  TouchableHighlight,
  Image,
} = React;
import userMng from '../logics/user-mng';
import FullScreenLoading from '../components/FullScreenLoading';
import wbCurrentMng from '../logics/wb-current-mng';
import DailyTask from '../components/DailyTask';
import WbShowByPhase from '../components/WbShowByPhase';
import * as constDefine from '../utils/const';

let WbPrefaceView = React.createClass({
  getInitialState: function() {
     return {
       isLoading: true
     }
  },

  componentDidMount: function() {
    let self = this;
    this.setState({ isLoading: true });
    wbCurrentMng.getFirstUnfinishedTask(function(err, task) {
      let parts = wbCurrentMng.buildP2WordPart();
      self.setState({
        parts: parts,
        task: task,
        isLoading: false
      });
    })
  },

  render: function() {
    let wb = wbCurrentMng.currUserWb;

    let familiaritySection = <View></View>;
    if (this.state.parts) {
      familiaritySection = (
        <View style={ styles.fstat }>
          <Text>熟练度分布情况:</Text>
          <View style={ styles.fcount }>
            <Text style={ styles.fitem }>F1: { this.state.parts[0].total }</Text>
            <Text style={ styles.fitem }>F2: { this.state.parts[1].total }</Text>
            <Text style={ styles.fitem }>F3: { this.state.parts[2].total }</Text>
            <Text style={ styles.fitem }>F4: { this.state.parts[3].total }</Text>
            <Text style={ styles.fitem }>F5: { this.state.parts[4].total }</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={ styles.container }>
        <View style={ styles.wbstatus }>
          <Image
            source={{uri: 'http://background.langlib.com/content/wb.jpg'}}
            style={styles.wbicon}
          />
        <View style={ styles.wbdesc } >
            <Text style={ styles.wbname }>{ constDefine.getWordBookCNName(wb.DictType) }</Text>
            <Text style={ styles.wbphase }>{ constDefine.getPhaseCNName(wb.CurrStatus) }</Text>
          </View>
        </View>
        { familiaritySection }

        { this.state.isLoading ? <FullScreenLoading></FullScreenLoading> : <WbShowByPhase wb={ wb } parts={ this.state.parts } task={ this.state.task }></WbShowByPhase> }
      </View>
    )
  }

});

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1
  },
  wbicon: {
    height: 60,
    width: 50,
    marginLeft: 5,
    marginRight: 20
  },
  wbtext: {

  },
  wbstatus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    height: 62
  },
  wbname: {
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 5
  },
  wbphase: {
    fontSize: 16,
    textAlign: 'left'
  },
  fstat: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    height: 50,
    paddingTop: 5
  },
  fcount: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },

});


export default WbPrefaceView;
