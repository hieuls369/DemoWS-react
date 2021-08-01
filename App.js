import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapContainer from './component/MapContainer';

import WebSocketSample from './component/WebSocketSample';

export default function App() {
  return (
    <View style={styles.container}>
      <MapContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
