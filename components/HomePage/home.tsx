import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  StyleSheet,
  Animated,
  ImageBackground,
} from 'react-native';
import {throttle} from 'lodash';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native';
import NavigateButton from '../NavigateButton/NavigateButton';
import FallAlertModal from '../FlashModal';
import Toast from 'react-native-toast-message';
import {getAddressFromCoordinates} from '../../API/apiGoogleMap';

const iconPath = Image.resolveAssetSource(require('../../icon/icon.png')).uri;
const iconRedPath = Image.resolveAssetSource(
  require('../../icon/icon_red.png'),
).uri;
// add the logo logo.svg
Sound.setCategory('Playback');

const MAPTILER_API_KEY = 'M0SphNh5JyPmZXgTLF25';
const STADIA_API_KEY = '361e6ffa-a171-4de2-bd00-ae57d3e055aa';
const STADIA_URL = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${STADIA_API_KEY}`;
const SPLY_API_KEY = '433296206bd06af68412063ab';
const mapLanguage = 'en';
const SPLY_StyleUrl = `https://api.slpy.com/style/slpy-mgl-style.json?key=${SPLY_API_KEY}&lang=${mapLanguage}`;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
  },
  fallDetectedContainer: {
    marginVertical: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallDetectedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  timeText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  image: {
    height: 280,
  },
  labelContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 20,
    left: '18%',
    width: '65%',
    borderWidth: 2,
    borderColor: '#EDF0F1',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#EDF0F1',
    shadowOffset: {width: 2, height: 22},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 22,
  },
  labelText: {
    color: '#58DDF5',
    fontSize: 25,
    fontWeight: 'bold',
  },
  labelText1: {
    color: '#4EA663',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
type ParsedEventData = {
  latitude: number;
  longitude: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  state: string;
};

const FallDetectionScreen = () => {
  console.log('call time');
  const sound = new Sound(
    require('../../assets/sounds/bipbip.mp3'),
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
    },
  );
  // const [currentLocation, setCurrentLocation] = useState(null);
  const currentLocation = useRef(null);
  const [fallDetected, setFallDetected] = useState(false);
  // const fallDetected = useRef(false);
  const animation = new Animated.Value(1);
  const [address, setAddress] = useState('');
  const [annotationCoordinates, setAnnotationCoordinates] = useState([
    108.3211776, 15.8892032,
  ]);
  // const annotationCoordinates = useRef([108.3211776, 15.8892032]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Please Grant GPS Permission',
          message: 'This app needs access to your GPS to show location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startTracking();
      } else {
        console.log('GPS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  function parseEventData(eventData: string): ParsedEventData {
    const [gpsData, sensorData, state] = eventData.split('|');
    const [latitude, longitude] = gpsData.split(',').map(Number);
    const [accelX, accelY, accelZ, gyroX, gyroY, gyroZ] = sensorData
      .split(',')
      .map(Number);
    return {
      latitude,
      longitude,
      accelX,
      accelY,
      accelZ,
      gyroX,
      gyroY,
      gyroZ,
      state,
    };
  }

  const startTracking = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newLocation = [longitude, latitude];
        // setCurrentLocation(newLocation);
        currentLocation.current = newLocation;
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const handleFallConfirmation = () => {
    // fallDetected.current = !fallDetected.current;
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);
  useEffect(() => {
    getAddressFromCoordinates(
      annotationCoordinates[1],
      annotationCoordinates[0],
      // annotationCoordinates.current[1],
      // annotationCoordinates.current[0],
    ).then(addresss => setAddress(addresss));
  }, [annotationCoordinates]);
  // useEffect(() => {
  //   if (fallDetected ) {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(animation, {
  //           toValue: 1.2,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(animation, {
  //           toValue: 1,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     ).start();
  //   } else {
  //     console.log('fall no');
  //   }
  // }, [fallDetected]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  // const throttledUpdate = throttle((newCoordinates: any) => {
  //   if (
  //     annotationCoordinates.current[0] !== newCoordinates[0] ||
  //     annotationCoordinates.current[1] !== newCoordinates[1]
  //   ) {
  //     annotationCoordinates.current = newCoordinates;
  //     // Cập nhật bản đồ hoặc các thành phần liên quan mà không re-render toàn bộ component
  //   }
  // }, 2000);
  const throttledUpdate = throttle((newCoordinates: any) => {
    setAnnotationCoordinates(prevCoordinates => {
      if (prevCoordinates[0] !== newCoordinates[0] || prevCoordinates[1] !== newCoordinates[1]) {
        return newCoordinates;
      }
      return prevCoordinates;
    });
  }, 2000);
  useEffect(() => {
    const socket = new WebSocket('ws://192.168.2.53:81/websocket');

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onmessage = event => {
      const dataFromServer = parseEventData(event.data);
      throttledUpdate([dataFromServer.longitude, dataFromServer.latitude]);
      console.log('Data from server:', dataFromServer);
      if (dataFromServer.state === 'fall' && !fallDetected) {
        setFallDetected(true);
        if (sound) {
          sound.play(success => {
            Toast.show({
              type: 'success',
              text1: 'Sound played',
            });
            if (!success) {
              Toast.show({
                type: 'error',
                text1: 'Sound did not play',
              });
            }
          });
        }
      }
      // console.log('Data from server:', dataFromServer);
    };

    socket.onerror = error => {
      console.log('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close(); // Đảm bảo đóng socket khi component unmount
    };
  }, []); // Dependency array trống để chỉ chạy 1 lần

  const animatedStyle = {
    transform: [{scale: animation}],
  };
  const closeModal = () => {
    //  console.log("zz: ", fallDetected.current);
    // fallDetected.current = false;
    setFallDetected(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.page]}>
        <MapLibreGL.MapView
          style={styles.map}
          styleURL={SPLY_StyleUrl}
          logoEnabled={false}
          attributionPosition={{bottom: 13, right: 13}}>
          <MapLibreGL.Camera
            centerCoordinate={
              // annotationCoordinates.current
              annotationCoordinates

            }
            zoomLevel={18}
          />
          <MapLibreGL.Annotation
            id="target"
            key="targetLocation"
            coordinates={
              // annotationCoordinates.current
              annotationCoordinates
            }
            icon={iconPath}
            style={{iconSize: 1}}
          />
          {currentLocation && (
            <MapLibreGL.Annotation
              id="current"
              key="currentLocation"
              coordinates={currentLocation.current}
              icon={iconRedPath}
              style={{iconSize: 1}}
            />
          )}
        </MapLibreGL.MapView>
        <NavigateButton page={'Home'} />
      </View>
      <TouchableOpacity
        style={styles.labelContainer}
        onPress={() => {
          // console.log("zz: ", fallDetected.current);
          // fallDetected.current = !fallDetected.current;
          setFallDetected(!fallDetected);
        }}>
        <Text style={styles.labelText}>Fall Detection</Text>
        <Text style={styles.labelText1} numberOfLines={1}>{address}</Text>
      </TouchableOpacity>
      {fallDetected && (
        <FallAlertModal
          visible={fallDetected}
          address={address}
          onClose={closeModal}
          sound={sound}
        />
      )}
    </SafeAreaView>
  );
};

export default FallDetectionScreen;
