import React, { Component } from 'react';
import { SafeAreaView, Share, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import {
  GradientBackground,
  Header,
  SecondaryButton,
  Text,
  BalanceRow
} from '../../components';
import WalletUtils from '../../utils/wallet';
import Footer from '../UIComponents/Footer/index';
import { DrawerActions } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  qrcodeContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingVertical: 5,
    width: 160,
  },
  addressTitle: {
    paddingHorizontal: 15,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
  },
  walletAddress: {
    paddingHorizontal: 15,
    color: '#9d9d9d',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

class WalletReceive extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onTokenChange: PropTypes.func.isRequired,
    walletAddress: PropTypes.string.isRequired,
  };

  state = {
    currentBalance: {
      'balance': 0,
      'usdBalance': 0,
    },
  };

  onRefresh = () => {
    this.fetchBalance();
  }

  fetchBalance = async () => {
    const currentBalance = await WalletUtils.getBalance(
      this.props.selectedToken,
    );

    this.setState({
      currentBalance,
    });
  };

  tokenChange = (val) => {
    console.log('token change to: ', val);
    this.props.setDefaultToken(token);
  }

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <LinearGradient
            colors={['#254a81', '#254a81']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientHeader}
          >
            <Header 
              hamBurgerPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}
              onBackPress={() => this.props.navigation.goBack()} 
              title="Receive" />
          
            <BalanceRow
              currentBalance={this.state.currentBalance}
              onTokenChangeIconPress={() =>
                this.props.navigation.navigate('TokenPicker')
              }
              onSettingsIconPress={() =>
                this.props.navigation.navigate('Settings')
              }
              tokenChange={this.tokenChange}
            />

          </LinearGradient>

          <View style={styles.qrcodeContainer}>
            <QRCode
              color="#090909"
              value={this.props.walletAddress}
              size={150}
            />
          </View>
          <View>
            <Text style={styles.addressTitle}>Address</Text>
            <Text style={styles.walletAddress}>{this.props.walletAddress}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={() => {
                Share.share({
                  message: this.props.walletAddress,
                  title: 'My XDCwallet address',
                });
              }}
              text="Share"
            />
          </View>
          <Footer
            activeTab="receive"
            onReceivePress={() => this.props.navigation.navigate('Receive')}
            onHomePress={() => this.props.navigation.navigate('WalletHome')}
            onSendPress={() =>
              this.props.navigation.navigate('Send', {
                onTokenChange: this.onTokenChange,
              })
            }
            ontransactionsPress={() => this.props.navigation.navigate('WalletTransactions')}
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  walletAddress: state.walletAddress,
});

const mapDispatchToProps = dispatch => ({
  onTokenChange: token => dispatch({ type: SET_DEFAULT_TOKEN, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletReceive);
