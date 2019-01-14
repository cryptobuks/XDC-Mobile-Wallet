import React from 'react'
import { StyleSheet, Image, Button, View, Text, SafeAreaView, ScrollView } from 'react-native'
import { DrawerNavigator, DrawerItems } from 'react-navigation';

const customDrawer = (props) => (
    <SafeAreaView style={{flex: 1}}>
        <View style={{height: 150, backgroundColor: '#254a81'}}>
            <Text style={styles.drawerHeader}>XinFin</Text>
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
        color: '#fff',
    }
});
export default customDrawer;