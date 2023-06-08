import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput as Input,
  Pressable,
  Linking,
} from 'react-native';
import styles from './styles';
// @ts-ignore
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getCategoryName, getCategoryById} from './MockDataAPI';
import BackButton from '../../components/BackButton/BackButton';
import {recipes} from './dataArrays';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';
import {LocationObject} from 'expo-location';
import {AppStyles} from '../AppStyles';
import SimpleLoading from '../../components/SimpleLoading';
import {StatusBar} from 'expo-status-bar';

const {width: viewportWidth} = Dimensions.get('window');
const apiKey = 'AIzaSyA21jY_Duhpd9We2h-ngMHri79ridaXwt8';

export default function RecipeScreen(props: {navigation: any; route: any}) {
  const {navigation, route} = props;
  const item = recipes[2];
  const category = getCategoryById(item.categoryId);
  // @ts-ignore
  const [activeSlide, setActiveSlide] = useState(0);
  const slider1Ref = useRef();
  const [image, setImage] = useState('');
  const [tweetText, setTweetText] = useState('');
  const [address, setAddress] = useState('');
  const placeHolderLocationButtonText = 'Set Location';
  const {keycloak} = useKeycloakNative() as {keycloak: any};
  const DEFAULT_IMAGE = {
    image1: require('../../../assets/twitter-image.jpeg'),
  };
  const [tweetLink, setTweetLink] = useState('');
  const [latt, setLatt] = useState(null);
  const [longg, setLongg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placeId, setPlaceId] = useState('');
  const bearerToken =
    'AAAAAAAAAAAAAAAAAAAAAGBslgEAAAAAjhfCt%2BoAm2qCbpHNBMMyhMcZLFU%3DWB9NwDN7kKbEnUwLnie2eKzOnySKznoIj0CjZ9tng58O34ZDsK';

  const getTwitterPlaceId = async (latitude: String, longitude: String) => {
    setLoading(true);
    const url = `https://api.twitter.com/1.1/geo/search.json?lat=${latitude}&long=${longitude}&accuracy=1000&max_results=1`;
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const resultJson = await result.json();
    console.log('Twitter Place ID: ' + resultJson.result.places[0].id);
    setPlaceId(resultJson.result.places[0].id);
    setLoading(false);
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
          Alert.alert('Done.');
        } else {
          Alert.alert('Unsuccessful. Try again.');
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert(`Some error when picking image: ${error.code}`);
      })
      .finally(() => {
        console.log('finally: Picking image process is done');
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

  const sendTweet = async () => {
    // Validation Checks
    // Check image exists
    if (image === '') {
      Alert.alert('Please select an image first!');
      return;
    }
    // Check tweet text exists
    if (tweetText === '') {
      Alert.alert('Please enter a tweet text first!');
      return;
    }
    // Check location exists
    if (address === '') {
      Alert.alert('Please set a location first!');
      return;
    }
    setLoading(true);

    // @ts-ignore
    var fileName = image.split('/').pop();

    console.log('Sending Tweet. FileName: ' + fileName);
    console.log('Sending Tweet. Image: ' + image);

    // find file type (image/jpeg, image/png, etc) based on file extension
    const fileType = fileName.split('.').pop();
    const fileTypeString = `image/${fileType}`;
    console.log('File Type: ' + fileTypeString);

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append('Accept', 'application/json');

    var formdata = new FormData();
    // @ts-ignore
    formdata.append('file', {
      uri: image,
      type: fileTypeString,
      name: fileName,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      'https://tweetback.giize.com/twitter/tweet/tweet-location?' +
        new URLSearchParams({
          latitude: latt,
          longitude: longg,
          placeId: placeId,
          tweet: tweetText,
        }),
      requestOptions,
    )
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error in sending tweet');
          throw new Error('Tweet Sent Response: ' + response.status);
        }
        console.log('Tweet Sent Response: ' + response.status);
        return response.text();
      })
      .then(result => {
        let resultJson = JSON.parse(result);
        console.log(resultJson.tweetLink);
        // check if tweetLink contains the string null
        if (resultJson.tweetLink.includes('null')) {
          Alert.alert(
            'The Tweet was sent successfully, but unable to fetch the tweet link!',
          );
        } else {
          Alert.alert('The Tweet was sent successfully!');
          setTweetLink(resultJson.tweetLink);
        }
      })
      .then(() => {
        console.log('Tweet Link: ' + tweetLink);
        emptyTweetAssets();
      })
      .catch(error => console.log('error', error))
      .finally(() => {
        // Empty tweet assets
        setLoading(false);
        console.log('finally: Sending tweet process is done');
      });
  };

  function emptyTweetAssets() {
    setImage('');
    setTweetText('');
    setAddress('');
    setLatt(null);
    setLongg(null);
    setLoading(false);
  }

  const handleSetLocation = (latitude, longitude) => {
    setLatt(latitude);
    setLongg(longitude);
    Location.setGoogleApiKey(apiKey);
    Location.reverseGeocodeAsync({
      longitude,
      latitude,
    }).then(regionName => {
      setAddress(
        `${regionName[0].street}, ${regionName[0].name}, ${regionName[0].country}`,
      );
      getTwitterPlaceId(latitude, longitude).then(() => {
        setLoading(false);
        console.log('Place ID: ' + placeId);
      });
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: 'true',
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, [navigation]);

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderImage = ({item}) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={item.image1} />
      </View>
    </TouchableHighlight>
  );

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderSingleImage = ({item}) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item}} />
      </View>
    </TouchableHighlight>
  );
  // @ts-ignore
  return (
    <>
      {!loading && (
        <ScrollView style={styles.container}>
          <View style={styles.carouselContainer}>
            <View style={styles.carousel}>
              {!image && (
                <Carousel
                  ref={slider1Ref}
                  data={[DEFAULT_IMAGE]}
                  renderItem={renderImage}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  firstItem={0}
                  loop={false}
                  autoplay={false}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={index => setActiveSlide(0)}
                />
              )}
              {image && (
                <Carousel
                  ref={slider1Ref}
                  data={[image]}
                  renderItem={renderSingleImage}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  firstItem={0}
                  loop={false}
                  autoplay={false}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={index => setActiveSlide(0)}
                />
              )}
            </View>
          </View>
          <View style={styles.infoRecipeContainer}>
            <Text style={styles.infoRecipeName}>Compose Tweet</Text>
            {/*Pick Image Button*/}
            {!image && (
              <View style={styles.infoContainer}>
                <TouchableOpacity
                  style={newStyles.loginContainer}
                  onPress={pickImage}>
                  <Text style={newStyles.loginText}>Choose Image</Text>
                </TouchableOpacity>
              </View>
            )}
            {/*Pick Image Button*/}
            {!image && (
              <View style={styles.infoContainer}>
                <TouchableOpacity
                  style={newStyles.loginContainer}
                  onPress={pickImageCamera}>
                  <Text style={newStyles.loginText}>Take a Picture</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.infoContainer}>
              <TouchableOpacity
                style={newStyles.loginContainer}
                onPress={() => {
                  // Empty address
                  setAddress('');
                  navigation.navigate('Maps', {
                    onSetLocation: handleSetLocation,
                  });
                }}>
                <Text style={newStyles.loginText}>
                  {address ? address : placeHolderLocationButtonText}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <Input
                placeholder="Write your tweet here"
                value={tweetText}
                onChangeText={text => setTweetText(text)}
                style={{
                  flex: 2,
                  marginLeft: 25,
                  marginTop: 30,
                  marginRight: 25,
                  lineHeight: 23,
                  textAlignVertical: 'top',
                  fontSize: 20,
                  // Keep 3 rows in the textbox
                  height: 120,
                }}
                allowFontScaling={true}
                multiline={true}
                numberOfLines={4}
                autoFocus={true}
                maxFontSizeMultiplier={0}
              />
            </View>
            <View style={styles.infoContainer}>
              <TouchableOpacity
                style={newStyles.loginContainerSpecial}
                onPress={() => sendTweet()}>
                <Text style={newStyles.loginText}>Tweet!</Text>
              </TouchableOpacity>
            </View>
            {/*Link to Tweet*/}
            {tweetLink && (
              <TouchableOpacity
                style={newStyles.loginContainerCheckTweet}
                onPress={() => Linking.openURL(tweetLink)}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  Check last Tweet!
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/*  Add small text in monospaced font at the bottom of the phone*/}
          <Text>
            {latt && longg && (
              <Text style={newStyles.footer}>Latitude: {latt}</Text>
            )}
            {latt && longg && (
              <Text style={newStyles.footer}> Longitude: {longg}</Text>
            )}
          </Text>
        </ScrollView>
      )}
      {loading && <SimpleLoading />}
    </>
  );
}

const newStyles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginContainerSpecial: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginContainerCheckTweet: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.greenBlue,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 12,
  },
});
