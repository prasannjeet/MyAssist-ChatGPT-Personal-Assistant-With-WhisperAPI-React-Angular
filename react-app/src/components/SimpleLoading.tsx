import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {useState} from 'react';
export default function SimpleLoading() {
  return (
    <View>
      <LottieView
        source={require('../../assets/80684-yoga.json')}
        style={styles.animation}
        autoPlay
      />
      <Text style={styles.text}>...sending tweet...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: 400,
    height: 400,
    textAlign: 'center',
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    // Align vertically center
    // flex: 1,
    // justifyContent: 'center',
    // Align horizontally center
    // alignItems: 'center',
  },
  text: {
    paddingTop: 250,
    fontSize: 30,
    textAlign: 'center',
  },
});
