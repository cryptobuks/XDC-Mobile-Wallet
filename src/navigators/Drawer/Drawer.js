import React, { Component } from 'react';
import { NavigationActions, DrawerItems, DrawerItem } from 'react-navigation';
import { StyleSheet, Image, ScrollView, Text, View, Alert } from 'react-native';
import logo from './images/logo.png';
import network from './images/network.png';
import PropTypes from 'prop-types';
import { LOGOUT } from '../../config/actionTypes';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navItemStyle: {
        padding: 15,
        fontSize: 20,
        fontWeight: "bold",
        color: "#000"
    },
    navSectionStyle: {
        flexDirection:'row',
        alignItems:'center',

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
    },
    Icons: {
        width: 22,
        height: 22,
        marginLeft:10,
    }
});


class CustomDrawer extends Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    render() {

        const { activeItemKey } = this.props;

        let activeTabStyle = [styles.navItemStyle, styles.activeLink];
        let normalTabStyle = [styles.navItemStyle];

        console.log('draweritem', this.props)
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.drawerContainer}>
                        <Image source={logo} style={styles.drawerHeader} />
                    </View>
                    <View>
                        <View style={styles.navSectionStyle}>
                            <Image source={network} style={styles.Icons} />
                            <Text
                                style={activeItemKey === 'Change Network' ? activeTabStyle : normalTabStyle}
                                onPress={this.navigateToScreen('Change Network')}>
                                Network Change
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={activeItemKey === 'Show Private Key' ? activeTabStyle : normalTabStyle}
                                onPress={this.navigateToScreen('Show Private Key')}>
                                Backup Private Key
                        </Text>
                        </View>
                        <View>
                            <Text
                                style={activeItemKey === 'Change Pin' ? activeTabStyle : normalTabStyle}
                                onPress={this.navigateToScreen('Change Pin')}>
                                Change Pin
                        </Text>
                        </View>
                        <View>
                            <Text
                                style={activeItemKey === 'Change Pin' ? activeTabStyle : normalTabStyle}
                                onPress={this.navigateToScreen('Change Pin')}>
                                Log in to web wallet
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