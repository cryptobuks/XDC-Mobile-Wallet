import React from 'react'
import { StyleSheet, Image, Button, View, Text, SafeAreaView, ScrollView } from 'react-native'
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import logo from './images/logo.png'

const customDrawer = (props) => (
    <SafeAreaView style={{flex: 1}}>
        <View style={styles.drawerContainer}>
            <Image source={logo} style={styles.drawerHeader} />
        </View>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
);

const styles = StyleSheet.create({
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
    }
});
export default customDrawer;