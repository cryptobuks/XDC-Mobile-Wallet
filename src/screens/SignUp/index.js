import React, { Component } from 'react';
import { Image, SafeAreaView, StyleSheet, View, Text, Platform, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import OAuthManager from 'react-native-oauth';
const manager = new OAuthManager('XDCWallet');

class SignUp extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };


  signUp = () => {

    let config
    let scopes

    if (Platform.OS === 'ios') {
      config = {
        google: {
          callback_url: `http://localhost/google`,
          client_id: '47621642897-0m87j98bjb3gmgqq1vb1sl81fsem9k62.apps.googleusercontent.com',
          client_secret: '8HPFSWc0D0xCk2sjNrYmiV7M'
        }
      }
      scopes = 'openid+email+profile'
    } else if (Platform.OS === 'android') { 
      config = {
        google: {
          callback_url: `http://localhost/google`,
          client_id: '47621642897-0m87j98bjb3gmgqq1vb1sl81fsem9k62.apps.googleusercontent.com',
          client_secret: '8HPFSWc0D0xCk2sjNrYmiV7M'
        }
      }
      scopes = 'email'
    }

    manager.configure(config);

    console.log(manager);

    const googleUrl = 'https://www.googleapis.com/plus/v1/people/me';

    manager.authorize('google', { scopes })
      .then(
        resp => {
          console.log(resp);
          manager.makeRequest('google', googleUrl, resp)
            .then(resp => {
              console.log('Data -> ', resp.data);
              AsyncStorage.setItem('UserEmail', resp.data.emails[0].value);
              if(AsyncStorage.getItem('UserEmail')) {
                this.props.navigation.navigate('Home');
              }
            })
            .catch(e => console.log(e));
        }
      )
      .catch(err => console.log(err));
    
  }

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>XDC Wallet</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              onPress={() => this.signUp()}
              text="Sign Up with Google"
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

export default connect(mapStateToProps)(SignUp);
