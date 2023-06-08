#!/bin/zsh

rm ./node_modules/expo-modules-core/android/build.gradle
cp ./temp/expo-module.build.gradle ./node_modules/expo-modules-core/android/build.gradle
