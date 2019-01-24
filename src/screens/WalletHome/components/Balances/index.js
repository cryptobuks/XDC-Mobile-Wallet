import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import { PieChart } from 'react-native-svg-charts';
import WalletUtils from '../../../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: 'transparent',
  },
  balanceWrap: {
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    backgroundColor: '#777',
    position: 'relative',
  },
  usdBalance: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: 100,
    left: 20,
  },
  balances: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    padding: 20,
    marginVertical: 15,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    height: '100%'
  },
  balanceDetails: {
    width: '48%',
    padding: 10,
    marginHorizontal: '1%',
    marginVertical: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenName: {
    color: '#000', 
    paddingTop: 10
  }
});

class Balances extends Component {

  state = {
    selectedSlice: {
      label: '',
      value: 0
    },
    labelWidth: 0,
    tokenList: null,
    tokenBalances: null,
  }

  static propTypes = {
    currentBalance: PropTypes.object.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  }

  fetchDashboardData = async (token, index) => {
    
          const balanceInfo = await WalletUtils.getBalance(token);
          let stateBalance = [];
          if(this.state.tokenBalances != null) {
            stateBalance = this.state.tokenBalances;
            stateBalance.push(balanceInfo);
          } else {
            stateBalance.push(balanceInfo);
          }
          console.log('balance obj', stateBalance);
          this.setState({
            tokenBalances: stateBalance
          })
          console.log('balance state', this.state.tokenBalances)
            // .then(resp => {
            //   balanceObj[index] = {
            //     [token.name]: index
            //   }
            //   this.setState({
            //     tokenBalances: balanceObj 
            //   })
            // })
            // .catch(err => {
            //   console.log('err',err)
            //   balanceObj[index] = {
            //     [token.name]: index
            //   }
            //   if(this.state.tokenList.length === balanceObj.length) {
            //     console.log('balance obj length', balanceObj.length, balanceObj)
            //     this.setState({
            //       tokenBalances: JSON.parse(JSON.stringify(balanceObj)) 
            //     })
            //   }
            // })
        
  }

  componentWillMount() {
    AsyncStorage.getItem('availableTokens')
    .then(r => {
      this.setState({
        tokenList: JSON.parse(r),
      });
      if(this.state.tokenList != null) {
        this.state.tokenList.map((token, index) => {
          this.fetchDashboardData(token);
        })
      }
    }).catch(e=>console.log(e));
  }

  render() {
    const {
      currentBalance,
      selectedToken,
    } = this.props;

    const { labelWidth, selectedSlice } = this.state;
    const { label, value } = selectedSlice;
    const keys = ['google', 'facebook', 'linkedin'];
    const values = [45, 25, 110];
    const colors = ['#254a81', '#8e44ad', '#f39c12', '#16a085', '#2c3e50']

    let tokens = null;
    if(this.state.tokenList != null && this.state.tokenBalances != null && this.state.tokenList.length === this.state.tokenBalances.length) {
      tokens = this.state.tokenList.map((token, index) => {
        
        return(
          <View style={styles.balanceDetails} key={index}>
            <View style={{width: '70%', borderTopColor: colors[index], borderTopWidth: 5}}>
              <Text style={styles.tokenName} letterSpacing={2}>
                {token.name}
              </Text>
              <Text style={{color: '#333'}} letterSpacing={2}>
                {this.state.tokenBalances[index].usdBalance.toFixed(2)}
              </Text>
              <Text style={{color: '#333'}} letterSpacing={2}>
                {this.state.tokenBalances[index].balance.toFixed(2)}
              </Text>
            </View>
          </View>
        )
        
      });
    }

    let data = null;
    let balanceInfo = null;
    if(this.state.tokenList != null && this.state.tokenBalances != null && this.state.tokenList.length === this.state.tokenBalances.length) {
      
      data = this.state.tokenBalances.map((token, index) => {
        const keyName = this.state.tokenList[index].name;
        const key = keyName;
        balanceInfo += token.usdBalance;
        console.log('global 1', index, token, key);
        return {
            key,
            value: token.usdBalance,
            svg: { fill: colors[index] },
            arc: { 
              outerRadius: '100%',
              innerRadius: '75%', 
              padAngle: label === token ? 0.1 : 0 
            },
            onPress: () => this.setState({ selectedSlice: { label: token, value: values[index] } })
        }
      });
      
    }
    
    
    return (
      <View style={styles.container}>
        <View style={styles.balanceWrap}>
        
        { data != null ? 
          <PieChart
              style={{ height: 175, width: '100%' }}
              data={data}
          />
        : null }

        { balanceInfo != null ?
          <View style={styles.usdBalance}>
            <Text style={{color: '#333', textAlign: 'center'}} letterSpacing={2}>
              {balanceInfo.toFixed(2)}
            </Text>
          </View>
        : null }
          
          <View style={styles.balances}>
              {tokens}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(Balances);
