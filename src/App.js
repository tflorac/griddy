/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from "react";
import type { Node } from "react";

import { Button, StatusBar, StyleSheet, View } from "react-native";

import Game from "./Level";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3b3b3b",
    },
    start: {
        justifyContent: 'center',
        paddingLeft: 100,
        paddingRight: 100
    }
});


const App: () => Node = () => {

    let [running, setRunning] = useState(false);

    if (!running) {
        return (
            <View style={[styles.container, styles.start]}>
                <StatusBar hidden={true} />
                <Button title="Start"
                        onPress={() => setRunning(true)} />
            </View>
        );
    }

    return <Game />;
};

export default App;
