import * as React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, BackHandler, Alert } from 'react-native';
import { useState } from 'react';
import { useEffect } from 'react';

const ws = new WebSocket('ws://54.169.37.0:8080/ws?account_id=hieu&role=parnter')

export default function MapContainer() {

    const locationShipper = new Map();
    const [displayLocation, setDisplayLocation] = useState([]);

    backPressed = () => {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.close()
                        }
                        BackHandler.exitApp()
                    }
                },
            ],
            { cancelable: false });
        return true;
    }

    useEffect(() => {
        ws.onopen = (e) => {
            console.log("Welcome to WS");
            ws.send(JSON.stringify({ action: 'join-room', message: 'lol' }))
        }

        ws.onmessage = (e) => {
            let data = e.data;
            data = data.split(/\r?\n/);
            for (let i = 0; i < data.length; i++) {
                let msg = JSON.parse(data[i]);
                switch (msg.action) {
                    case "send-message":
                        if (msg.sender !== null) {
                            let coord = msg.message.split(/,/);
                            let lat = parseFloat(coord[0]);
                            let log = parseFloat(coord[1]);
                            let location = { lat, log }
                            locationShipper.set(msg.sender.account_id, location);
                        }
                        break;
                    case "user-join":
                        break;
                    case "user-left":
                        if (msg.sender !== null) {
                            locationShipper.delete(msg.sender.account_id)
                        }

                        console.log(msg);
                        break;
                    case "room-joined":
                        break;
                    default:
                        break;
                }
            }
            let test = locationShipper;
            setDisplayLocation(Array.from(test));

        };
        BackHandler.addEventListener('hardwareBackPress', backPressed);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backPressed);
        }

    }, [])


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 21.0348159,
                    longitude: 105.7768545,
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0121,
                }}
            >
                {displayLocation.map(([key, value], index) => (
                    <Marker
                        key={index}
                        image={require('../assets/rocketIcon.png')}
                        coordinate={{ latitude: value.lat, longitude: value.log }}
                        title='this is center'
                        description='nothing special'
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});