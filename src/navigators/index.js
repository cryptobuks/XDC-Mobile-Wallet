import { 
  createStackNavigator, 
  createSwitchNavigator,
  DrawerNavigator,
} from 'react-navigation';
import {Easing, Animated} from 'react-native';
import {
  AddTokenScreen,
  AppLoadingScreen,
  CameraScreen,
  CreateWalletScreen,
  HomeScreen,
  SignUpScreen,
  NetworkPickerScreen,
  PinCodeScreen,
  PrivateKeyScreen,
  RecoverWalletScreen,
  SettingsScreen,
  TokenPickerScreen,
  WalletHomeScreen,
  WalletReceiveScreen,
  WalletSendScreen,
} from '../screens';

import CustomDrawer from './Drawer/Drawer'

const WelcomeNavigator = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    SignUp: {
      screen: SignUpScreen,
    },
    CreateWallet: {
      screen: CreateWalletScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    RecoverWallet: {
      screen: RecoverWalletScreen,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'SignUp',
  },
);

const WalletMainNavigator = createStackNavigator(
  {
    AddToken: {
      screen: AddTokenScreen,
    },
    Camera: {
      screen: CameraScreen,
    },
    CreateWallet: {
      screen: CreateWalletScreen,
    },
    WalletHome: {
      screen: WalletHomeScreen,
    },
    NetworkPicker: {
      screen: NetworkPickerScreen,
    },
    PrivateKey: {
      screen: PrivateKeyScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Receive: {
      screen: WalletReceiveScreen,
    },
    Send: {
      screen: WalletSendScreen,
    },
    TokenPicker: {
      screen: TokenPickerScreen,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'WalletHome',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig : () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
      },
    }),
  },
);

const SendNavigator = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    SendMain: {
      screen: WalletSendScreen,
    },
    TokenPicker: {
      screen: TokenPickerScreen,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'SendMain',
  },
);

const WalletNavigator = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    WalletMain: {
      screen: WalletMainNavigator,
    },
    Receive: {
      screen: WalletReceiveScreen,
    },
    Send: {
      screen: SendNavigator,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'WalletMain',
    mode: 'modal',
  },
);

const DrawerNavigation = DrawerNavigator({
  'Home': {
      screen: WalletHomeScreen,
  },
  'Send': {
      screen: WalletSendScreen,
  },
  'Change Pin': {
    screen: CreateWalletScreen,
  },
  'Change Network': {
    screen: NetworkPickerScreen,
  },
  'Show Private Key':{
    screen:PrivateKeyScreen,
  },
},
{
  contentComponent: CustomDrawer,
  contentOptions: {
    activeTintColor: '#254a81',
  },
  drawerPosition: 'left',
  drawerBackgroundColor: 'white',
  drawerWidth: 270,
  drawerType: 'back'
});

export default createSwitchNavigator(
  {
    AppLoading: AppLoadingScreen,
    PinCode: PinCodeScreen,
    Wallet: WalletNavigator,
    Welcome: WelcomeNavigator,
    Drawer: DrawerNavigation,
  },
  {
    initialRouteName: 'AppLoading',
  },
);