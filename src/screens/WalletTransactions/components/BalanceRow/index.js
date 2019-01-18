import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Picker } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';

import switchIcon from './images/add.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: 'transparent',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  balance: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingRight: 5,
  },
  coinSymbol: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 15,
    paddingBottom: 2,
    paddingLeft: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  switchIcon: {
    height: 24,
    marginRight: 20,
    marginTop: 1,
    width: 24,
  },
  tokenPicker: {
    position: 'absolute',
    top: 0,
    width: 1000,
    height: 1000,
  },
});

class BalanceRow extends Component {
  static propTypes = {
    currentBalance: PropTypes.object.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
    onTokenChangeIconPress: PropTypes.func.isRequired,
    tokenChange: PropTypes.func.isRequired,
  };

  // tokenChange = (data) => {
  //   console.log('token change balancerow', this.props);
  //   this.props.tokenChange(data)
  // }

  render() {
    const {
      currentBalance,
      selectedToken,
      onTokenChangeIconPress,
      tokenChange
    } = this.props;

    return (
      <View style={styles.container}>

      <Picker
        selectedValue={selectedToken.name}
        style={{width: '100%', height: 50}}
        onValueChange={(itemValue, itemIndex) => tokenChange(itemValue)}>
        <Picker.Item label="XDC" value="xdc" />
        <Picker.Item label="ETH" value="eth" />
      </Picker>
        
        {/* <View style={styles.balanceContainer}>
          <Text style={styles.balance} letterSpacing={1}>
            {currentBalance.usdBalance.toFixed(2)}
          </Text>
          <Text style={styles.coinSymbol} letterSpacing={2}>
            {selectedToken.currencySymbol}
          </Text>
        </View>
        
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={onTokenChangeIconPress}>
            <Image source={switchIcon} style={styles.switchIcon} />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(BalanceRow);
