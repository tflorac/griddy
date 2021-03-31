
import React, { useContext } from "react";
import { View, Text } from "react-native"

import { StylesContext } from "../styles";


/**
 * Score display components
 */
const Score = ({score}) => {

    const styles = useContext(StylesContext);

    return (
        <View style={styles.score}>
            <View><Text style={styles.scoreText}>Score: </Text></View>
            <View><Text style={styles.scoreText}>{score} pts</Text></View>
        </View>
    );
};

export default Score;
