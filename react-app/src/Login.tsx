import React from 'react';
// import styles from './styles';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';

import {Button, Text, View} from 'react-native-ui-lib';

// @ts-ignore
function Login({navigation}): JSX.Element {
  const {keycloak} = useKeycloakNative() as {keycloak: any};

  console.log('Hello');

  return (
    <View flex paddingH-25 paddingT-120>
      <View>
        <Text>
          {`User is ${!keycloak.authenticated ? 'NOT ' : ''}authenticated`}
        </Text>
        {!keycloak.authenticated && (
          <Button onPress={() => keycloak.login()} label="Login" />
        )}
        {/* @ts-ignore */}
        {!!keycloak.authenticated && (
          <View>
            <Text>{`Welcome ${keycloak.tokenParsed.preferred_username}`}</Text>
            <Button onPress={() => keycloak.logout()} label="Logout" />
            <Button
              label="Go to Twitter"
              onPress={() => navigation.navigate('PostTwitter')}
            />
            <Button
              label="Go to New Twitter"
              onPress={() => navigation.navigate('PostTweet')}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default Login;
