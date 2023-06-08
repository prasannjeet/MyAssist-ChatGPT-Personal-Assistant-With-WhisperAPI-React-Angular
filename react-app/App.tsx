/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {ReactNativeKeycloakProvider, RNKeycloak} from '@react-keycloak/native';
import Login from './src/Login';
import PostTwitter from './src/components/PostTwitter';
import {Button} from 'react-native-ui-lib';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PostTweet from './src/components/PostTweet';
import WalkthroughScreen from './src/screens/WalkthroughScreen/WalkthroughScreen';
import WalkthroughAppConfig from './src/WalkthroughAppConfig';
import DynamicAppStyles from './src/DynamicAppStyles';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RecipeScreen from './src/screens/Recipe/RecipeScreen';
import MyNativeMap from './src/components/MyNativeMap';
import {LogBox} from 'react-native';
import ChatGpt from './src/components/ChatGpt';

const keycloak = new RNKeycloak({
  url: 'https://keycloak.ooguy.com:8443',
  realm: 'timetable-oauth',
  clientId: 'flutter-client',
});

const Stack = createStackNavigator();

// @ts-ignore
function HomeScreen({navigation}) {
  return (
    <WalkthroughScreen
      appConfig={WalkthroughAppConfig}
      appStyles={DynamicAppStyles}
      navigationObject={navigation}
    />
  );
}

// <Button label="Go to Login" onPress={() => navigation.navigate('Login')} />

function App(): JSX.Element {
  LogBox.ignoreAllLogs();
  return (
    <ReactNativeKeycloakProvider
      authClient={keycloak}
      initOptions={{
        redirectUri: 'socialflow://Homepage',
        // if you need to customize "react-native-inappbrowser-reborn" View you can use the following attribute
        inAppBrowserOptions: {
          // For iOS check: https://github.com/proyecto26/react-native-inappbrowser#ios-options
          // For Android check: https://github.com/proyecto26/react-native-inappbrowser#android-options
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: 'gray',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
        },
      }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PostTwitter" component={PostTwitter} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="PostTweet" component={PostTweet} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Tweet" component={RecipeScreen} />
          <Stack.Screen name="Maps" component={MyNativeMap} />
          <Stack.Screen name="Chat" component={ChatGpt} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReactNativeKeycloakProvider>
  );
}

export default App;
