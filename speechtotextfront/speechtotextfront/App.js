import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Nunito_600SemiBold, useFonts } from '@expo-google-fonts/nunito';
import { AudioVisu, Box, ChatBox, Container, ContenChat, Content, ConvertText, Footer, Picture } from './Styles';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import axios from 'axios';
import { headers } from 'react-native-axios/lib/defaults';

export default function App() {
  const [fontLoaded, setFontLoaded] = useFonts({
    Nunito_600SemiBold
  })
  const [isclicked, setIsClicked] = useState()
  const [chatClicked, setChatClicked] = useState()
  const [textSpeech, setTextSpeech] = useState()
  const [textSend, setTextSend] = useState()
  const [sound, setSound] = useState();
const [uri,  setUri] = useState();
  const iconSize = isclicked ? 60 : 50

  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();



  if (!fontLoaded) {
    return null;
  }
async function sendTextApi(){
  await axios.post('http://192.168.19.120:4056/TextToSpeech', {texto: textSend}).then(response => {

  console.log(response.data)
  setUri(response.data.audioUrl)

}).catch(function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
});
}
  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setIsClicked(true)

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    setIsClicked(false)
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    const form = new FormData()

    form.append('Arquivo', {
      uri: uri, name: 'audio.m4a', type: 'audio.m4a'
    })
    await axios.post('http://192.168.19.120:4056/SpeechToText', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {

      console.log(response.data)

      setTextSpeech(response.data.texto)

    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }


  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(uri)
    
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log('Unloading Sound');
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);



  return (
    <Container>
      <Content>
        <AudioVisu>
          {
            isclicked ?
              <Picture source={require("../speechtotextfront/assets/gif.gif")} />
              :
              <>
                <Picture source={require("../speechtotextfront/assets/logo.png")} />
              </>

          }

        </AudioVisu>
        {
          textSpeech ? <ConvertText>{textSpeech}</ConvertText> : null
        }
        <Box onPress={() => playSound()}>
        <AntDesign name="play" size={50} color="#b1a7f2" />
        </Box>
        {
          chatClicked ?

            <ContenChat>

              <Box onPress={() => setChatClicked(false)}>
                <AntDesign name="closecircleo" size={40} color="white"  />
              </Box>

              <ChatBox
               onChangeText={ (value)=> {setTextSend(value)} }
                placeholder="Digite oque deseja"
               placeholderTextColor="#b1a7f2"
               valeu={textSend}
               >
                
              </ChatBox>

              <Box onPress={async () => await sendTextApi()}>
              <FontAwesome name="send" size={35} color="#b1a7f2" />
              </Box>

            </ContenChat>
            :
            <Footer>
              {
                isclicked ?
                  <></>
                  :
                  <Box onPress={() => setChatClicked(true)}>
                    <Ionicons name="chatbox" size={45} color="#b1a7f2" />
                  </Box>
              }

              {
                isclicked ?
                  <Box onPress={async () => {
                    await recording.stopAndUnloadAsync();
                    setIsClicked(false)
                  }}>
                    <AntDesign name="closecircleo" size={30} color="white" />
                  </Box>
                  :
                  <></>
              }
              <Box onPress={() => isclicked == true ? stopRecording() : startRecording()}>
                <FontAwesome name="microphone"
                  size={iconSize} color="#c785f2" />
              </Box>
            </Footer>


        }


      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
