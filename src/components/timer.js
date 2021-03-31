
import React, { useContext } from "react";
import { Text, View } from "react-native";

import { StylesContext } from "../styles";
import { GameEngine } from "react-native-game-engine";


/**
 * Timer display component
 */
const Timer = ({remaining}) => {

    const styles = useContext(StylesContext);

    return (
        <View style={styles.timerView}>
            <Text style={[
                styles.timer,
                remaining < 10 ? styles.timerEnding : {}
            ]}>Time left: {remaining}"</Text>
        </View>
    );
}

export default Timer;
