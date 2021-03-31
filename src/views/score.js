import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, useColorScheme, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DARK_STYLE, DEFAULT_STYLE } from "../styles";


/**
 * High scores view
 *
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
const HighScoresView = ({navigation}) => {

    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? DARK_STYLE : DEFAULT_STYLE;

    let [scores, setHighScores] = useState([]);

    useEffect(async () => {
        try {
            const scores = await AsyncStorage.getItem('@griddy/scores');
            if (scores) {
                setHighScores(JSON.parse(scores));
            }
        } catch (exc) {}
    }, []);

    return (
        <View style={styles.innerPage}>
            <View style={styles.pageView}>
                <View style={styles.scoresHead}>
                    <Text style={styles.scoresHeadText}>High scores</Text>
                </View>
                <ScrollView>
                    {scores.map((item, idx) => {
                        return (
                            <View key={idx}
                                  style={styles.scoresItem}>
                                <Text style={styles.text}>
                                    {new Date(item.timestamp).toLocaleString()}
                                </Text>
                                <Text style={[styles.scoresSize, styles.text]}>
                                    {item.size} x {item.size}
                                </Text>
                                <Text style={[styles.scoresDuration, styles.text]}>
                                    {item.duration}"
                                </Text>
                                <Text style={[styles.scoresScore, styles.text]}>
                                    {item.score}
                                </Text>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <View style={styles.actionsView}>
                <Button title="Back"
                        style={styles.actionButton}
                        onPress={() => navigation.navigate("Home")} />
            </View>
        </View>
    );
};

export default HighScoresView;
