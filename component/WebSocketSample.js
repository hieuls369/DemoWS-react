import React, { useEffect, useState } from 'react'
import { Alert, BackHandler, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'



var ws = new WebSocket('ws://54.169.37.0:8080/ws?account_id=hieu123&role=shipper');

const WebSocketSample = () => {

    const roomName = 'lol'
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    var roomId = '';

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
        var myTimer = null;
        if (isEnabled) {
            ws = new WebSocket('ws://54.169.37.0:8080/ws?account_id=hieu&role=shipper')
            console.log("Open");
            ws.onopen = (e) => {
                console.log("Welcome to WS");
                ws.send(JSON.stringify({ action: 'join-room', message: roomName }))

                myTimer = setInterval(() => {
                    if (roomId !== '') {
                        console.log("hi im in room", roomId);
                        ws.send(JSON.stringify({
                            action: 'send-message',
                            message: "hello",
                            target: {
                                id: roomId,
                                name: roomName
                            }

                        }))
                    }
                }, 5000);
            }
            ws.onmessage = (e) => {
                let data = e.data;
                data = data.split(/\r?\n/);
                for (let i = 0; i < data.length; i++) {
                    let msg = JSON.parse(data[i]);
                    switch (msg.action) {
                        case "send-message":
                            break;
                        case "user-join":
                            break;
                        case "user-left":
                            break;
                        case "room-joined":
                            if (msg.target !== null) {
                                console.log(msg.target.id);
                                let id = msg.target.id
                                roomId = id;
                                console.log(roomId);
                            }
                            break;
                        default:
                            break;
                    }
                }
            };
            ws.onclose = (e) => {
                clearInterval(myTimer);
                console.log("hi im out");
            }
        } else {
            console.log("Close");
            ws.close()
        }


    }, [isEnabled])


    const sendMessageHandle = () => {
        return ws.send(JSON.stringify({
            action: 'send-message',
            message: "hi",
            target: {
                id: roomId,
                name: roomName
            }

        }))
    }


    return (
        <View style={styles.container}>
            <Text>Websocket</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={sendMessageHandle}
            >
                <Text style={styles.buttonSend}>Send Message</Text>
            </TouchableOpacity>
            <Switch
                trackColor={{ false: "#FBD1D1", true: "#C4C4C4" }}
                thumbColor={isEnabled ? "#FF7777" : "#FF7777"}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />

        </View>
    )
}

export default WebSocketSample

const styles = StyleSheet.create({
    container: {

        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    button: {
        margin: 10,
        backgroundColor: '#BF332E',
        borderRadius: 5,
    },
    buttonSend: {
        padding: 10,
        alignItems: 'center',
        fontSize: 15,
        color: '#fff'
    }
})
