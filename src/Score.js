
import React from "react";
import { View, StyleSheet, Text } from "react-native"


const styles = StyleSheet.create({
    score: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        top: 20,
        color: '#fff'
    },
    text: {
        color: '#fff',
        fontFamily: 'Syne Mono',
        fontSize: 25
    }
});


const Score = ({score}) => {

    return (
        <View style={styles.score}>
            <View><Text style={styles.text}>Score: </Text></View>
            <View><Text style={styles.text}>{score} pts</Text></View>
        </View>
    );
};

export default Score;
