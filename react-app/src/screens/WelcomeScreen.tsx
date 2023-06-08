import React, {useEffect} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppStyles} from './AppStyles';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';

// @ts-ignore
function WelcomeScreen({navigation}): JSX.Element {
  const {keycloak} = useKeycloakNative() as {keycloak: any};
  const hasOpenAI: any = keycloak.hasRealmRole('openapi');
  const [request, setRequest] = React.useState(false);
  const [requestValue, setRequestValue] = React.useState('');

  useEffect(() => {
    checkRequestStatus();
  }, []);

  const checkRequestStatus = async () => {
    let myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch('https://tweetback.giize.com/roles/status', requestOptions)
      .then(response => {
        if (!response.ok) {
          console.log('Error checking request status');
          return;
        }
        return response.text();
      })
      .then(val => {
        if (val === 'APPROVED') {
          setRequest(true);
          setRequestValue('APPROVED');
        } else if (val === 'PENDING') {
          setRequest(true);
          setRequestValue('PENDING');
        } else if (val === 'REJECTED') {
          setRequest(true);
          setRequestValue('REJECTED');
        } else if (val === 'NOT_REQUESTED') {
          setRequest(false);
          setRequestValue('NOT_REQUESTED');
        }
      })
      .catch(error => console.log('error', error));
  };

  const requestAccess = async () => {
    let myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch('https://tweetback.giize.com/roles/request', requestOptions)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error', 'Could not request access. Try again later.');
          return;
        }
        return response.text();
      })
      .then(() => {
        setRequest(true);
        setRequestValue('PENDING');
        //Create a sample message if empty
        Alert.alert(
          'Success',
          'Request sent successfully. Please wait for approval.',
        );
      })
      .catch(error => console.log('error', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hello {keycloak?.tokenParsed?.given_name}!
      </Text>
      {!keycloak.authenticated && (
        <>
          <Text style={styles.title}>
            Welcome to MyAssist! Please login to continue.
          </Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => keycloak.login()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
      {!!keycloak.authenticated && hasOpenAI && (
        <>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() =>
              navigation.navigate('Chat', {
                condition: true,
              })
            }>
            <Text style={styles.loginText}>Go To MyAssist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => keycloak.logout()}>
            <Text style={styles.signupText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
      {!request && !!keycloak.authenticated && !hasOpenAI && (
        <>
          <Text>You don't have permission to access Personal Assistant</Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => requestAccess()}>
            <Text style={styles.loginText}>Request for Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => keycloak.logout()}>
            <Text style={styles.signupText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
      {request && !!keycloak.authenticated && !hasOpenAI && (
        <>
          <Text>Permission to access assistant registered.</Text>
          <Text>Request Status: {requestValue}</Text>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => keycloak.logout()}>
            <Text style={styles.signupText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// PostTweet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  loginContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: 'coral',
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: 'indigo',
  },
  signupContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 8,
    borderWidth: 1,
    borderColor: AppStyles.color.tint,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.tint,
  },
  spinner: {
    marginTop: 200,
  },
});

export default WelcomeScreen;
