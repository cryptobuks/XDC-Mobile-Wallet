import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Platform, Alert, View } from 'react-native';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Modal from 'react-native-modal';
import DialogAndroid from 'react-native-dialogs';
import Text from '../../../Text';
import arrowIcon from './images/arrow.png';
import touchIdIcon from './images/touchid.png';

const styles = StyleSheet.create({
  keyboardKey: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 20,
  },
  textPlaceholder: {
    color: 'transparent',
    fontSize: 40,
  },
  arrowKey: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    height: 24,
    width: 24,
  },
  touchIdIcon: {
    height: 40,
    width: 40,
  },
  ModalItem: {
    color: '#000',
  },
  ModalItemTitle: {
    color: '#000',
  }
});

export default class PinKeyboard extends Component {
  static propTypes = {
    onBackPress: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func,
    showBackButton: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onAuthSuccess: null,
  };

  state = {
    isTouchIdSupported: false,
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible});
  }

  componentDidMount() {
    if (this.props.onAuthSuccess) {
      this.checkTouchIdSupport();
    }
  }

  onTouchIdClick = async () => {
    this.toggleModal();
    let modalAlert =  <Modal 
                        onBackdropPress={() => this.toggleModal(null)}
                        isVisible={this.state.isModalVisible} 
                        style={styles.ModalContainer}>
                        <View style={styles.ModalView}>
                          <Text style={styles.ModalItem}>
                            <Text style={styles.ModalItemTitle}>Authentication Required</Text>
                          </Text>
                          <Text style={styles.ModalItem}>
                            <Text style={styles.ModalItemTitle}>Touch fingerprint sensor to unlock your wallet</Text>
                          </Text>
                        </View>
                      </Modal>
    try {
      if (Platform.OS === 'android') {
        console.log('platform.os')
        Alert.alert(
          'Authentication Required',
          "Touch fingerprint sensor to unlock your wallet",
        );

        // modalAlert

        await FingerprintScanner.authenticate({
          onAttempt: () => {},
        });

        this.props.onAuthSuccess();

        
      } else {
        await FingerprintScanner.authenticate({
          description: 'Wallet access',
        });

        this.props.onAuthSuccess();
      }
    } catch (error) {
      console.log('error:::'. error);
    }
  };

  checkTouchIdSupport = async () => {
    try {
      const isSensorAvailable = await FingerprintScanner.isSensorAvailable();

      if (isSensorAvailable) {
        this.setState({
          isTouchIdSupported: true,
        });

        this.onTouchIdClick();
      }
    } catch (error) {
      // An error happened during biometric detection
    }
  };

  render() {
    if (this.props.showBackButton) {
      return (
        <TouchableOpacity
          style={[styles.keyboardKey, styles.arrowKey]}
          onPress={this.props.onBackPress}
        >
          <Image source={arrowIcon} style={styles.arrowIcon} />
        </TouchableOpacity>
      );
    }

    if (this.state.isTouchIdSupported) {
      return (
        <TouchableOpacity
          style={[styles.keyboardKey, styles.arrowKey]}
          onPress={this.onTouchIdClick}
        >
          <Image source={touchIdIcon} style={styles.touchIdIcon} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.keyboardKey}>
        <Text style={styles.textPlaceholder}> 0 </Text>
      </TouchableOpacity>
    );
  }
}
