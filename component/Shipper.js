import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ws = new WebSocket('ws://54.169.37.0:8080/ws?account_id=hieu&role=shipper')

const Shipper = () => {


    useEffect(() => {
        var myTimer = null;
        var count = 0;
        ws.onopen = (e) => {
            console.log("Welcome to WS");
            ws.send(JSON.stringify({ action: 'join-room', message: 'lol' }))
            myTimer = setInterval(() => {
                count++;
                console.log("hi: ", count);
            }, 5000);
        }

        ws.onclose = (e) => {
            console.log("Closing");
            clearInterval(myTimer);
        }
    }, [])

    return (
        <View>
            <Text>Hi</Text>
        </View>
    )
}

export default Shipper

const styles = StyleSheet.create({})
