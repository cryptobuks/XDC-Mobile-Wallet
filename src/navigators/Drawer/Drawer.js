import React, {Component} from 'react';
import { connect } from 'react-redux';
import {NavigationActions, DrawerItems, DrawerItem} from 'react-navigation';
import {StyleSheet , Image, ScrollView, Text, View, Alert, TouchableOpacity} from 'react-native';
import logo from './images/logo.png';
import PropTypes from 'prop-types';
import { persistor } from '../../config/store';
import { LOGOUT } from '../../config/actionTypes';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navItemStyle: {
        padding: 15,
        fontSize:20,
        fontWeight:"bold",
        color:"#000"
    },
    navSectionStyle: {
    },
    sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    footerContainer: {
        padding: 20,
        backgroundColor: 'lightgrey'
    },
    drawerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 75,
    },
    drawerContainer: {
        height: 150,
        backgroundColor: '#254a81',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeLink: {
        color: '#254a81',
        backgroundColor: '#efefef',
    }
});


class CustomDrawer extends Component {
    navigateToScreen = (route, editMode) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction, {
            editMode: editMode,
        });
    }
    
    render () {
        
        const length = this.props.navigation.state.routes["0"].routes.length;
        const activeItemKey = this.props.navigation.state.routes["0"].routes[length - 1].routeName;

        let activeTabStyle = [styles.navItemStyle, styles.activeLink];
        let normalTabStyle = [styles.navItemStyle];
        
        console.log('draweritem', this.props.navigation.state.routes["0"].routes[length - 1].routeName);
        return (
          <View style={styles.container}>
            <ScrollView>
                <View style={styles.drawerContainer}>
                    <Image source={logo} style={styles.drawerHeader} />
                </View>
                <View>
                    <View style={styles.navSectionStyle}>
                        <Text 
                            style={activeItemKey === 'WalletHome' ? activeTabStyle : normalTabStyle} 
                            onPress={this.navigateToScreen('WalletHome', false)}>
                            Home
                        </Text>
                        <Text 
                            style={activeItemKey === 'Send' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('Send', false)}>
                            Send
                        </Text>
                        <Text 
                            style={activeItemKey === 'Receive' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('Receive', false)}>
                            Receive
                        </Text>
                        <Text 
                            style={activeItemKey === 'CreateWallet' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('CreateWallet', true)}>
                            Change Pin
                        </Text>
                        <Text 
                            style={activeItemKey === 'NetworkPicker' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('NetworkPicker', false)}>
                            Change Network
                        </Text>
                        <Text 
                            style={activeItemKey === 'PrivateKey' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('PrivateKey', false)}>
                            Export Private Key
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
                <TouchableOpacity
                    onPress = { () => 
                        Alert.alert(
                          'Logout',
                          'Your wallet will be erased from your device. Make sure to backup your private key before going further.',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => {},
                              style: 'cancel',
                            },
                            {
                              text: 'OK',
                              onPress: async () => {
                                await this.props.logout();
                                this.props.navigation.navigate('SignUp');
                              },
                            },
                          ],
                          { cancelable: false },
                        ) 
                    // onPress={()=>
                    //     Alert.alert(
                    //         'Log out',
                    //         'Do you want to logout?',
                    //         [
                    //         {text: 'Cancel', onPress: () => {return null}},
                    //         {text: 'Confirm', onPress: () => {
                    //             Asyncstorage.clear();
                    //             this.props.navigation.navigate('Home')
                    //         }},
                    //         ],
                    //         { cancelable: false }
                    //     )  
                }>
                    <Text style={{fontWeight: 'bold'}}>Logout</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
    }
}

CustomDrawer.propTypes = {
    navigation: PropTypes.object,
    logout: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
    logout: async () => {
      dispatch({ type: LOGOUT });
      await persistor.flush();
    },
});

export default connect(null, mapDispatchToProps)(CustomDrawer);