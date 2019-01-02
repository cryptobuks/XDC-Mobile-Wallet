import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default class GradientBackground extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <LinearGradient colors={['#6591ff', '#9069ff']} style={styles.background}>
        {this.props.children}
      </LinearGradient>
    );
  }
}
