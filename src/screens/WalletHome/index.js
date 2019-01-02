import React, { Component } from 'react';
import { AppState, Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Text } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import {
  BalanceRow,
  CallToAction,
  Footer,
  TransactionsList,
} from './components';
import { SET_CALL_TO_ACTION_DISMISSED } from '../../config/actionTypes';
import WalletUtils from '../../utils/wallet';
import { relative } from 'path';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  topContainer: {
    flex: 1,
  },
  gradientHeaderWrapper: {
    height: 150,
    position: 'relative',
  },
  gradientHeader: {
    width: '100%',
    height: 130,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  gradientHeaderShadow: {
    position: 'absolute',
    width: '92%',
    marginLeft: '4%',
    bottom: 10,   
    height: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  gradientHeaderShadowTwo: {
    position: 'absolute',
    width: '86%',
    marginLeft: '7%',
    bottom: 0,   
    height: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  coinName: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 18,
    letterSpacing: 3,
    paddingVertical: 5,
    textAlign: 'center',
  },
  bannerContainer: {
    backgroundColor: '#372F49',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  bannerText: {
    color: '#9D9D9D',
  },
  listContainer: {
    flex: 1,
  },
});

class WalletHome extends Component {
  static propTypes = {
    callToActionDismissed: PropTypes.bool.isRequired,
    dismissCallToAction: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    walletAddress: PropTypes.string,
  };

  static defaultProps = {
    walletAddress: '',
  };

  state = {
    currentBalance: 0,
    appState: AppState.currentState,
    refreshingTransactions: false,
    transactions: [],
  };

  componentDidMount() {
    this.addEventListeners();
    this.onRefresh();
    this.loadTokensList();
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.walletAddress &&
      this.props.selectedToken !== newProps.selectedToken
    ) {
      this.setState(
        {
          currentBalance: 0,
          transactions: [],
        },
        () => {
          this.onRefresh();
        },
      );
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  onCallToActionPress = () => {
    this.props.navigation.navigate('Settings');
    this.props.navigation.navigate('PrivateKey');
  };

  onCallToActionDismiss = () => {
    Alert.alert(
      'Backup your wallet',
      "Make sure you've backed up your wallet private key. It can't be recovered if you lose it.",
      [
        { text: 'Ask me later' },
        {
          text: 'OK',
          onPress: async () => {
            this.props.dismissCallToAction();
          },
        },
      ],
    );
  };

  onRefresh = () => {
    this.fetchBalance();
    this.fetchTransactions();
    this.signInWithGoogle();
  };

  handleAppStateChange = nextAppState => {
    const currentState = this.state.appState;

    this.setState({ appState: nextAppState });

    if (currentState === 'background' && nextAppState === 'active') {
      this.props.navigation.navigate('PinCode');
    }
  };

  addEventListeners = () => {
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  removeEventListeners = () => {
    AppState.removeEventListener('change', this.handleAppStateChange);
  };

  signInWithGoogle = async () => {
    const status = await WalletUtils.OAuthSignIn();

    this.setState({
      status,
    })
  }

  fetchBalance = async () => {
    const currentBalance = await WalletUtils.getBalance(
      this.props.selectedToken,
    );

    this.setState({
      currentBalance,
    });
  };

  

  fetchTransactions = async () => {
    this.setState({
      refreshingTransactions: true,
    });

    const transactions = await WalletUtils.getTransactions(
      this.props.selectedToken,
    );

    this.setState({
      refreshingTransactions: false,
      transactions,
    });
  };

  loadTokensList = () => {
    WalletUtils.loadTokensList();
  };

  render() {
    console.log('selectedToken', this.props.selectedToken);
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.gradientHeaderWrapper}>
              <LinearGradient
                colors={['#7f0fc9', '#4d00ff']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientHeader}
              >
                <Text style={styles.coinName} letterSpacing={2}>
                  {this.props.selectedToken.name}
                </Text>
                <BalanceRow
                  currentBalance={this.state.currentBalance}
                  onTokenChangeIconPress={() =>
                    this.props.navigation.navigate('TokenPicker')
                  }
                  onSettingsIconPress={() =>
                    this.props.navigation.navigate('Settings')
                  }
                />
              </LinearGradient>
              <LinearGradient
                colors={['rgba(127,15,201,0.7)', 'rgba(77,0,255,0.7)']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientHeaderShadow}
              ></LinearGradient>
              <LinearGradient
                colors={['rgba(127,15,201,0.5)', 'rgba(77,0,255,0.5)']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientHeaderShadowTwo}
              ></LinearGradient>
            </View>
            {!this.props.callToActionDismissed && (
              <CallToAction
                onDismiss={this.onCallToActionDismiss}
                onPress={this.onCallToActionPress}
              />
            )}
            <View style={styles.bannerContainer}>
              <Text style={styles.bannerText}>
                Showing recent {this.props.selectedToken.name} transactions
              </Text>
            </View>
            <View style={styles.listContainer}>
              {!!this.props.walletAddress && (
                <TransactionsList
                  selectedToken={this.props.selectedToken}
                  transactions={this.state.transactions}
                  walletAddress={this.props.walletAddress}
                  onRefresh={this.onRefresh}
                  refreshing={this.state.refreshingTransactions}
                />
              )}
            </View>
          </View>
          <Footer
            onReceivePress={() => this.props.navigation.navigate('Receive')}
            onSendPress={() =>
              this.props.navigation.navigate('Send', {
                onTokenChange: this.onTokenChange,
              })
            }
            onSettingPress={() => this.props.navigation.navigate('Settings')}
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  callToActionDismissed: state.callToActionDismissed,
  selectedToken: state.selectedToken,
  walletAddress: state.walletAddress,
});

const mapDispatchToProps = dispatch => ({
  dismissCallToAction: () => dispatch({ type: SET_CALL_TO_ACTION_DISMISSED }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WalletHome);
