import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

interface FallAlertModalProps {
  visible: boolean;
  address: string;
  onClose: () => void;
  sound: Sound
}

const FallAlertModal: React.FC<FallAlertModalProps> = ({visible, address, onClose, sound}) => {
  const animation = new Animated.Value(1);
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle = {
    transform: [{scale: animation}],
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.fallDetectedContainer, animatedStyle]}>
            <LinearGradient
              colors={['#FF4500', '#D32F2F']}
              style={styles.gradientContainer}>
              <Text style={styles.fallDetectedText}>Fall Detected!</Text>
              <Text style={styles.addressText}>Location: {address}</Text>
              <TouchableOpacity onPress={()=>{sound.stop(); onClose()}} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default FallAlertModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fallDetectedContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientContainer: {
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  fallDetectedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  addressText: {
    fontSize: 18,
    color: '#ffeb3b',
    fontWeight: '600',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
