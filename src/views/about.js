
import React from "react";
import { Button, Text, useColorScheme, View } from "react-native";

import config from "../config/config.json";
import { DARK_STYLE, DEFAULT_STYLE } from "../styles";


/**
 * About view
 *
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
const AboutView = ({navigation}) => {

    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? DARK_STYLE : DEFAULT_STYLE;

    return (
        <View style={[styles.container, styles.spacedView]}>
            <View style={styles.homeText}>
                <Text style={[styles.appName, styles.text]}>Griddy</Text>
                <Text style={[styles.version, styles.text]}>version {config.version}</Text>
                <Text style={[styles.author, styles.text]}>by Thierry Florac</Text>
            </View>
            <View style={styles.homeText}>
                <Text style={styles.text}>
                    <Text style={styles.strong}>Griddy</Text> is a small
                    game which was developed in a few days to learn React Native
                    framework, with the help of React Native Game Engine.
                </Text>
                <Text></Text>
                <Text style={styles.text}>
                    It is mainly a clone of another game I played a few years ago,
                    but that I can't find anymore on the store...
                </Text>
                <Text></Text>
            </View>
            <View style={[styles.startView, styles.actionsView]}>
                <Button title="Back"
                        onPress={() => navigation.navigate("Home")} />
            </View>
        </View>
    );
};

export default AboutView;
