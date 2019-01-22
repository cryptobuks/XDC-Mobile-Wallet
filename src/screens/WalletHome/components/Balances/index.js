import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import { PieChart } from 'react-native-svg-charts';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 20,
    flex: 1,
  },
  balanceWrap: {
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#fff',
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
    padding: 10,
    marginVertical: 15,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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
    labelWidth: 0
  }

  static propTypes = {
    currentBalance: PropTypes.object.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      currentBalance,
      selectedToken,
    } = this.props;


    const { labelWidth, selectedSlice } = this.state;
    const { label, value } = selectedSlice;
    const keys = ['google', 'facebook', 'linkedin', 'youtube'];
    const values = [45, 25, 110, 20];
    const colors = ['#254a81', '#8e44ad', '#f39c12', '#16a085', '#2c3e50']
    const data = keys.map((key, index) => {
        return {
          key,
          value: values[index],
          svg: { fill: colors[index] },
          arc: { 
            outerRadius: '100%',
            innerRadius: '75%', 
            padAngle: label === key ? 0.1 : 0 
          },
          onPress: () => this.setState({ selectedSlice: { label: key, value: values[index] } })
        }
      });

    console.log('custom balance:::', currentBalance)

    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.balanceWrap}>
          <PieChart
              style={{ height: 175, width: '100%' }}
              data={data}
          />

          <View style={styles.usdBalance}>
            <Text style={{color: '#333', textAlign: 'center'}} letterSpacing={2}>
              {currentBalance.usdBalance.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.balances}>
            <View style={[styles.balanceDetails, {}]}>
              <View style={{width: '70%', borderTopColor: colors[0], borderTopWidth: 5}}>
                <Text style={styles.tokenName} letterSpacing={2}>
                  {this.props.selectedToken.name}
                </Text>
                <Text style={{color: '#333'}} letterSpacing={2}>
                  {currentBalance.usdBalance.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={[styles.balanceDetails, {}]}>
            <View style={{width: '70%', borderTopColor: colors[1], borderTopWidth: 5}}>
                <Text style={styles.tokenName} letterSpacing={2}>
                  {this.props.selectedToken.name}
                </Text>
                <Text style={{color: '#333'}} letterSpacing={2}>
                  {currentBalance.usdBalance.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={[styles.balanceDetails, {}]}>
              <View style={{width: '70%', borderTopColor: colors[2], borderTopWidth: 5}}>
                <Text style={styles.tokenName} letterSpacing={2}>
                  {this.props.selectedToken.name}
                </Text>
                <Text style={{color: '#333'}} letterSpacing={2}>
                  {currentBalance.usdBalance.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={[styles.balanceDetails, {}]}>
              <View style={{width: '70%', borderTopColor: colors[3], borderTopWidth: 5}}>
                <Text style={styles.tokenName} letterSpacing={2}>
                  {this.props.selectedToken.name}
                </Text>
                <Text style={{color: '#333'}} letterSpacing={2}>
                  {currentBalance.usdBalance.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(Balances);
