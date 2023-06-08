import React, {useState} from 'react';
import {
  Button,
  Colors,
  Icon,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {LocationObject} from 'expo-location';
import {Alert, TextInput as Input} from 'react-native';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';
import Tweet from '../Tweet';

const apiKey = 'AIzaSyA21jY_Duhpd9We2h-ngMHri79ridaXwt8';

const PostTweet = () => {
  const [image, setImage] = useState('');
  const [tweet, setTweet] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [address, setAddress] = useState('');
  const [url, setUrl] = useState('');
  const {keycloak} = useKeycloakNative() as {keycloak: any};

  const sendTweet = async () => {
    // @ts-ignore
    var fileName = image.split('/').pop();

    console.log('Sending Tweet. FileName: ' + fileName);
    console.log('Sending Tweet. Image: ' + image);

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append('Accept', 'application/json');

    var formdata = new FormData();
    // @ts-ignore
    formdata.append('file', {
      uri: image,
      name: fileName,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      'https://tweetback.giize.com/twitter/tweet/tweet-image?' +
        new URLSearchParams({
          // @ts-ignore
          // tweet: this.tweet,
          tweet: 'Just another tweet, again!',
        }),
      requestOptions,
    )
      .then(response => {
        console.log('Tweet Sent Response: ' + JSON.stringify(response));
        return response.text();
      })
      .then(result => {
        console.log('Tweet Sent Result' + JSON.stringify(result));
      })
      .catch(error => console.log('error', error));
  };

  const pickImage = async () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })
      .then(theResult => {
        console.log(theResult);
        if (!theResult.canceled) {
          setImage(theResult.assets[0].uri);
          console.log('ImageXX: ' + JSON.stringify(theResult));
          console.log('Debug: ' + image);
          console.log('Debug: ' + theResult.assets[0].uri);
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Some error when picking image: ${error.code}');
      })
      .finally(() => {
        console.log('finally: Picking image is done');
      });
  };

  const pickImageCamera = async () => {
    ImagePicker.requestCameraPermissionsAsync()
      .then(result => {
        console.log('First Block' + JSON.stringify(result));
        ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        })
          .then(theImage => {
            console.log('Second Block' + JSON.stringify(theImage));
            if (!theImage.canceled) {
              setImage(theImage.assets[0].uri);
            }
          })
          .catch(error => {
            console.log(
              'Some error when picking image from camera: \n' +
                JSON.stringify(error),
            );
            Alert.alert(
              `Some error when picking image from camera: \n
              ${error.code}`,
            );
          })
          .finally(() => {
            console.log('finally: Picking image from camera process is done');
          });
      })
      .catch(error => {
        console.log(error);
        Alert.alert('For this to work app needs camera roll permissions...');
      })
      .finally(() => {
        console.log('finally: Camera process is done');
      });
  };

  const getLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }

    Location.setGoogleApiKey(apiKey);

    // @ts-ignore
    let coords: LocationObject = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      // @ts-ignore
      maximumAge: 10000,
    });

    console.log('Received location');

    // @ts-ignore
    setLocation(coords);

    if (coords) {
      console.log(coords);
      let {longitude, latitude} = coords.coords;
      Location.reverseGeocodeAsync({
        longitude,
        latitude,
      }).then(regionName => {
        console.log(regionName, 'regionName');
        setAddress(
          `${regionName[0].street}, ${regionName[0].name}, ${regionName[0].country}`,
        );
      });
    }
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/*<TouchableOpacity onPress={pickImage}>*/}
        {/*  <Icon name="image" source={Assets.icons.image} />*/}
        {/*</TouchableOpacity>*/}
        <Button onPress={pickImage} label="Add image from Gallery" />
        <Button onPress={pickImageCamera} label="Add image from Camera" />
        <Input
          placeholder="Write your tweet here"
          value={tweet}
          onChangeText={text => setTweet(text)}
          style={{flex: 1, marginLeft: 10}}
        />
      </View>
      {image && (
        <Image source={{uri: image}} style={{height: 200, marginTop: 20}} />
      )}
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        {/*<TouchableOpacity onPress={getLocation}>*/}
        {/*  <Icon*/}
        {/*    tintColor={Colors.grey40}*/}
        {/*    margin-30*/}
        {/*    name="location"*/}
        {/*    source={Assets.icons.location}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}
        <Button onPress={getLocation} label="Add location" />
        <Text style={{marginLeft: 10}}>
          {/*{location*/}
          {/*  ? location.coords.latitude + ', ' + location.coords.longitude*/}
          {/*  : 'Location will appear here'}*/}
          {address ? address : 'Address will appear here'}
        </Text>
      </View>
      <Button
        label="Post Tweet"
        style={{marginTop: 20}}
        onPress={() => sendTweet()}
      />
      <Tweet tweetUrl="https://twitter.com/ilyamiskov/status/1626947843977105408" />

      <TouchableOpacity
        onPress={getLocation}
        aria-hidden={false}
        aria-checked={true}>
        <Icon
          source={{
            uri: 'https://github.com/wix/react-native-ui-lib/blob/master/demo/src/assets/icons/delete.png',
          }}
          size={24}
          tintColor={Colors.grey40}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PostTweet;
