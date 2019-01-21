import React, {Component} from 'react';
import {NavigationActions, DrawerItems, DrawerItem} from 'react-navigation';
import {StyleSheet , Image, ScrollView, Text, View, Alert} from 'react-native';
import logo from './images/logo.png';
import PropTypes from 'prop-types';
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
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
        routeName: route
    });
        this.props.navigation.dispatch(navigateAction);
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
                            onPress={this.navigateToScreen('WalletHome')}>
                            Home
                        </Text>
                        <Text 
                            style={activeItemKey === 'Send' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('Send')}>
                            Send
                        </Text>
                        <Text 
                            style={activeItemKey === 'Receive' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('Receive')}>
                            Receive
                        </Text>
                        <Text 
                            style={activeItemKey === 'CreateWallet' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('CreateWallet')}>
                            Change Pin
                        </Text>
                        <Text 
                            style={activeItemKey === 'NetworkPicker' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('NetworkPicker')}>
                            Change Network
                        </Text>
                        <Text 
                            style={activeItemKey === 'PrivateKey' ? activeTabStyle : normalTabStyle}
                            onPress={this.navigateToScreen('PrivateKey')}>
                            Export Private Key
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
              <Text>footer</Text>
            </View>
          </View>
        );
    }
}

CustomDrawer.propTypes = {
    navigation: PropTypes.object,
    logout: PropTypes.func,
};

export default CustomDrawer;