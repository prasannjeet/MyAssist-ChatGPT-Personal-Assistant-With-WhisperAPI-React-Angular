import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Chat, MessageType} from '@flyerhq/react-native-chat-ui';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';
import {AppStyles} from '../screens/AppStyles';
import {Audio} from 'expo-av';
import * as Location from 'expo-location';
import {RecordingObject} from 'expo-av/build/Audio/Recording.types';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const apiKey = 'AIzaSyA21jY_Duhpd9We2h-ngMHri79ridaXwt8';

function ChatGpt(this: any, {route, navigation}): JSX.Element {
  const {condition} = route.params;
  const {keycloak} = useKeycloakNative() as {keycloak: any};
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.RecordingObject>();
  const [recordingUri, setRecordingUri] = useState<string | undefined>();
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const [user, setUser] = useState({
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
  });
  const [address, setAddress] = useState('');
  const assistantUser = {id: '06c33e8b-e835-4736-80f4-63f44b66666d'};
  // TODO: Move below to env file. Add OPENAI key here. Best practice is to not add keys within the code.
  const openApiKey = 'open-ai-key-must-be-added-here';

  useEffect(() => {
    console.log('Condition is: ' + condition);
    if (condition) {
      console.log('Getting Conversation now');
      console.log('Keycloak ID is: ' + keycloak.subject);
      setUser(prevUser => ({
        ...prevUser,
        id: keycloak.subject,
      }));

      getConversation().then(() => {
        console.log('Conversation Getting process done.');
      });
    }
  }, [condition]);

  useEffect(() => {
    console.log('Messages changed');
  }, [messages]);

  const getConversation = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);
    myHeaders.append('Accept', 'application/json');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      'https://tweetback.giize.com/autocomplete/allmessages',
      requestOptions,
    )
      .then(response => {
        return response.text();
      })
      .then(result => {
        let messageObject = JSON.parse(result);
        //Create a sample message if empty
        if (messageObject.length === 0) {
          const textMessage: MessageType.Text = {
            author: assistantUser,
            createdAt: Date.now(),
            id: uuidv4(),
            text: "Hi, I'm the assistant. How can I help you?",
            type: 'text',
          };
          addMessage(textMessage);
        } else {
          // do something
          let allMessages: MessageType.Any[] = [];
          messageObject.forEach((messageItem: any) => {
            allMessages.push(convertMessageObjectToMessageType(messageItem));
          });
          const sortedMessages = allMessages.sort((a, b) => {
            const epochTimeA = a.createdAt;
            const epochTimeB = b.createdAt;
            return epochTimeB - epochTimeA;
          });

          addMessages(sortedMessages);
        }
      })
      .catch(error => console.log('error', error));
  };

  const convertMessageObjectToMessageType = (messageObject: any) => {
    const tempMainUser = {id: keycloak.subject};
    let message: MessageType.Text = {
      author: messageObject.author.match(assistantUser.id)
        ? assistantUser
        : tempMainUser,
      createdAt: parseInt(messageObject.createdAt),
      id: messageObject.id,
      text: messageObject.text,
      type: messageObject.type,
    };
    return message;
  };

  const getAssistantResponse = async (promptItem: string) => {
    console.log('Getting Assistant Response for: ' + promptItem);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);
    myHeaders.append('Accept', 'application/json');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      'https://tweetback.giize.com/autocomplete/completion?' +
        new URLSearchParams({
          // @ts-ignore
          // tweet: this.tweet,
          prompt: promptItem,
        }),
      requestOptions,
    )
      .then(response => {
        return response.text();
      })
      .then(result => {
        console.log('Completion response: ' + JSON.parse(result).content);
        let resultObj = JSON.parse(result);
        const repliedMessage: MessageType.Text = {
          author: assistantUser,
          createdAt: Date.now(),
          id: uuidv42(),
          text: resultObj.content.trim(),
          type: 'text',
        };
        addMessage(repliedMessage);
      })
      .catch(error => console.log('error', error));
  };

  const onRecordPressIn = async () => {
    setIsRecording(true);
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      let recordingObject: RecordingObject = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recordingObject);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const onRecordPressOut = async () => {
    setIsRecording(false);
    console.log('Stopping recording..');
    // setRecording(undefined);
    await recording?.recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.recording.getURI();
    setRecordingUri(uri?.toString());
    if (uri) {
      getTextFromRecording(uri.toString());
    }
  };

  const getTextFromRecording = (recordingPath: string) => {
    let fileName = recordingPath?.split('/').pop();

    console.log('Sending Recording. FileName: ' + fileName);

    let myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${openApiKey}`);
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append('Accept', 'application/json');

    let formdata = new FormData();
    // @ts-ignore
    formdata.append('file', {
      uri: recordingPath,
      name: fileName,
      type: 'audio/m4a',
    });
    formdata.append('model', 'whisper-1');
    formdata.append(
      'prompt',
      'Hello, thanks for the message. Could you please clear chat.',
    );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://api.openai.com/v1/audio/transcriptions', requestOptions)
      .then(response => {
        return response.text();
      })
      .then(result => {
        console.log('Audio Processing Result: ');
        console.log(result);
        const finalText = JSON.parse(result).text;
        //Check if finalText contains at least one alphanumeric character
        const regex = /^[ .]*$/;
        if (finalText && !regex.test(finalText)) {
          handleAudioMessageReceived(finalText, true);
        } else {
          console.log('No Text Returned from Audio Processing');
          handleAudioMessageReceived(
            'Sorry, No Text Returned from Audio Processing',
            false,
          );
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const clearUserChat: () => void = () => {
    let myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak.token}`);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch('https://tweetback.giize.com/autocomplete/clearChat', requestOptions)
      .then(response => {
        // check if response is ok 200
        if (!response.ok) {
          throw new Error('Network response was not ok to clear chat');
        }
        return response.text();
      })
      .then(result => {
        console.log('result after clearning chat');
        console.log(result);
        setMessages(() => []);
        const textMessage: MessageType.Text = {
          author: assistantUser,
          createdAt: Date.now(),
          id: uuidv4(),
          text: "Hi, I'm the assistant. How can I help you?",
          type: 'text',
        };
        setMessages(() => [textMessage]);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const getLocation: () => Promise<string> = async () => {
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
    // setLocation(coords);

    if (coords) {
      console.log('Coordinates Received: ', coords.coords);
      let {longitude, latitude} = coords.coords;
      const regionName = await Location.reverseGeocodeAsync({
        longitude,
        latitude,
      });
      console.log(regionName, 'regionName');
      let subLocation: string | null = '';
      if (regionName[0].city === undefined || regionName[0].city === null) {
        subLocation = regionName[0].region;
      } else {
        subLocation = regionName[0].city;
      }
      const computedAddress = `${subLocation}, ${regionName[0].country}`;
      setAddress(computedAddress);
      return computedAddress;
    } else {
      console.log('No coordinates received');
      return '';
    }
  };

  const preProcessQuery = async (text: string) => {
    console.log(`Received text: "${text}" for processing`);
    let clearTextCommands = [
      'clear chat',
      'clear chat please',
      'clear the chat',
      'clear the chat please',
      'please clear chat',
      'please clear the chat',
    ];
    const cleanedText = text.trim().replace(/[.,]/g, '').toLowerCase();
    let getLocationCommand = 'my location';

    let finalText = text;

    // check if text contains get location command
    if (text.includes(getLocationCommand)) {
      console.log('Text contains get location command');
      let locationVar = '';
      if (address) {
        console.log('Address already exists. Address: ', address);
        finalText = text.replace(getLocationCommand, address);
        locationVar = address;
      } else {
        console.log('Address does not exist. Getting location');
        locationVar = await getLocation();
        finalText = text.replace(getLocationCommand, locationVar);
        console.log('Location received. Address: ', address);
        console.log('Final text after replacing location: ', finalText);
      }
      const textMessage: MessageType.Text = {
        author: assistantUser,
        createdAt: Date.now(),
        id: uuidv4(),
        text:
          'Got your location @' +
          locationVar +
          " and I'm fetching some results",
        type: 'text',
      };
      addMessage(textMessage);
      await getAssistantResponse(finalText);
      return;
    } else if (clearTextCommands.some(command => command === cleanedText)) {
      console.log('Text contains clear chat command');
      clearUserChat();
      return;
    } else {
      console.log('Text does not contain any special commands');
      await getAssistantResponse(finalText);
      return;
    }
  };

  const handleAudioMessageReceived = (
    message: string,
    messageReceived: boolean,
  ) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message,
      type: 'text',
    };
    addMessage(textMessage);
    if (messageReceived) {
      console.log('Sending query for pre processing');
      preProcessQuery(message).then(() => {
        console.log('Finished pre processing query');
      });
    }
  };

  const addMessage = (message: MessageType.Any) => {
    setMessages(prevMessages => [message, ...prevMessages]);
  };

  const addMessages = (newMessages: MessageType.Any[]) => {
    setMessages(prevMessages => [...newMessages, ...prevMessages]);
  };

  const handleSendPress = (message: MessageType.PartialText) => {
    handleAudioMessageReceived(message.text, true);
  };

  // For the testing purposes, you should probably use https://github.com/uuidjs/uuid
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r % 4) + 8;
      return v.toString(16);
    });
  };

  const uuidv42 = () => {
    return 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r % 4) + 8;
      return v.toString(16);
    });
  };

  return (
    // Remove this provider if already registered elsewhere
    // or you have React Navigation set up
    <SafeAreaProvider>
      <Chat messages={messages} onSendPress={handleSendPress} user={user} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.signupContainer}
          onPressIn={onRecordPressIn}
          onPressOut={onRecordPressOut}>
          <Text style={styles.signupText}>
            {isRecording ? 'Recording...' : 'Press and Hold to Record'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 20,
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
});

export default ChatGpt;
