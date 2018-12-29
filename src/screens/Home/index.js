import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import logo from './images/logo.png';
import OAuthManager from 'react-native-oauth';
const manager = new OAuthManager('XDCWallet');

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };


  signIn = () => {
    const config = {
      twitter: {
        consumer_key: 'SOME_CONSUMER_KEY',
        consumer_secret: 'SOME_CONSUMER_SECRET'
      },
      google: {
        callback_url: `io.fullstack.FirestackExample:/oauth2redirect`,
        client_id: '47621642897-0m87j98bjb3gmgqq1vb1sl81fsem9k62.apps.googleusercontent.com',
        client_secret: '8HPFSWc0D0xCk2sjNrYmiV7M'
      }
    };

    manager.configure(config);

    console.log(manager);

    manager.authorize('google')
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
            <Text style={styles.logoText}>XDC Wallet</Text>
          </View>
          <View style={styles.buttonsContainer}>
            {/* <PrimaryButton
              onPress={() => this.signIn()}
              text="Sign In with Google"
            /> */}
            <PrimaryButton
              onPress={() => this.props.navigation.navigate('CreateWallet')}
              text="Create wallet"
            />
            <SecondaryButton
              onPress={() =>
                this.props.navigation.navigate('CreateWallet', {
                  recoverMode: true,
                })
              }
              text="Recover wallet"
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: '65%',
  },
  logoText: {
    width: '90%',
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingHorizontal: 15,
    width: '100%',
  },
});

const mapStateToProps = state => ({
  walletAddress: state.walletAddress,
});

export default connect(mapStateToProps)(Home);
