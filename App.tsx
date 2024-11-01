import React, {useEffect, useState} from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import AppNavigator from './Navigattion/AppNavigator';
import Toast from 'react-native-toast-message';
MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

export default class App extends React.Component {
  render() {
    return (
      <>
        <AppNavigator />
        <Toast />
      </>
    );
  }
}
