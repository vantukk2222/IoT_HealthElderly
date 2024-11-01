import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const NavigateButton = ({page}) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(page);

  const handleNavigate = (selectedPage) => {
    setActiveTab(page);
    navigation.navigate(selectedPage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Home' && styles.activeTab]}
        onPress={() => handleNavigate('Home')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'Home' && styles.activeTabText,
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'History' && styles.activeTab]}
        onPress={() => handleNavigate('History')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'History' && styles.activeTabText,
          ]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 35,
    borderWidth: 2,
    marginHorizontal: 40,
    borderColor: 'white',
    borderRadius: 35,
    shadowOffset: {width: 2, height: 22},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 22,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: '#58DDF5',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#58DDF5',
  },
  activeTabText: {
    color: 'white',
  },
});

export default NavigateButton;
