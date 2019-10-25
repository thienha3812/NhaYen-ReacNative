import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const Camera: () => React$Node = (props) => {
    useEffect(() => {
        const ws = new WebSocket("ws://192.168.5.2:9000/ws")
        ws.onopen = function () {
            console.log("connected")
        }
        ws.onmessage = function (data) {
            let base64 = JSON.parse(data.data).message
            setSrcImg('data:image/png;base64,' + base64)
        }
    }, [])
    return (
        <WebView style={{flex:1}} source={{ uri: 'http://103.101.162.116/camera1.html' }}/>
    );
}
Camera.navigationOptions = {
    title : "Giám sát nhà yến"
}
export default Camera;