import React, {useState} from 'react';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {enableLatestRenderer} from 'react-native-maps';
import {MaterialIcons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import {LocationObject} from 'expo-location';

const apiKey = 'AIzaSyA21jY_Duhpd9We2h-ngMHri79ridaXwt8';
const mapRef: React.RefObject<unknown> = React.createRef();

function MyNativeMap(this: any, {route, navigation}): JSX.Element {
  const {onSetLocation} = route.params;
  enableLatestRenderer();
  const {keycloak} = useKeycloakNative() as {keycloak: any};

  const [region, setRegion] = React.useState({
    latitude: 56.8532441,
    longitude: 14.8258032,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState([
    {
      id: 1,
      coordinate: {
        latitude: 56.8532441,
        longitude: 14.8258032,
      },
    },
  ]);

  const handleSetLocation = () => {
    if (markers) {
      onSetLocation(
        markers[0].coordinate.latitude,
        markers[0].coordinate.longitude,
      );
    }
    navigation.goBack();
    // code to go back to the original component
  };

  const getCurrentLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    Location.setGoogleApiKey(apiKey);

    let location: LocationObject = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      // @ts-ignore
      maximumAge: 10000,
    });

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0522,
      longitudeDelta: 0.0121,
    });
    console.log('region', region.latitude, region.longitude);

    setMarkers(prevMarkers => []);
    setMarkers(prevMarkers => [
      {
        id: 1,
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      },
    ]);

    mapRef?.current?.animateCamera({
      center: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  const CurrentLocationButton = ({onPress}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.currentLocationButton}>
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{marginTop: 0, flex: 1}}>
      <MapView
        // create an event when clicked anywhere in the map
        onPress={e => {
          // console log the coordinates
          let lat = e.nativeEvent.coordinate.latitude;
          let long = e.nativeEvent.coordinate.longitude;
          console.log('Map clicked', lat);
          setMarkers(prevMarkers => []);
          setMarkers(prevMarkers => [
            {
              id: 1,
              coordinate: {
                latitude: lat,
                longitude: long,
              },
            },
          ]);
        }}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 56.8532441,
          longitude: 14.8258032,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0121,
        }}>
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title="Selected Location"
            draggable={true}
            pinColor={'blue'}
            onDragStart={e => {
              // console log the coordinates
              console.log('Drag start', e.nativeEvent.coordinate.latitude);
            }}
            onDragEnd={e => {
              let lat = e.nativeEvent.coordinate.latitude;
              let long = e.nativeEvent.coordinate.longitude;
              setMarkers(prevMarkers => [
                {
                  id: 1,
                  coordinate: {
                    latitude: lat,
                    longitude: long,
                  },
                },
              ]);
            }}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSetLocation}>
          <Text style={styles.buttonText}>Set Location</Text>
        </TouchableOpacity>
      </View>
      <CurrentLocationButton onPress={getCurrentLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  currentLocationButton: {
    backgroundColor: '#4285F4',
    borderRadius: 24,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyNativeMap;
