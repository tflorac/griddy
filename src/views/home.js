
import React  from "react";
import { Button, Text, useColorScheme, View } from "react-native";

import { DARK_STYLE, DEFAULT_STYLE } from "../styles";


/**
 * Home screen
 *
 * @param navigation
 * @param onStart
 * @returns {JSX.Element}
 * @constructor
 */
const HomeScreen = ({ navigation, onStart }) => {

    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? DARK_STYLE : DEFAULT_STYLE;

    return (
        <View style={[styles.container, styles.spacedView]}>
            <View style={styles.homeText}>
                <Text style={styles.text}>
                    Welcome to <Text style={styles.strong}>Griddy</Text>, a
                    small time losing game made by a developer who couldn't
                    pay for a graphic designer!
                </Text>
                <Text></Text>
                <Text style={styles.text}>
                    The rules are very simple: starting from any "cell", you
                    can "link" adjacent cells whose number is equal, just above
                    or just below the value of the last chained cell; points
                    you get are based on the chain length and on cells values...
                    with a limited amount of time!
                </Text>
                <Text></Text>
                <Text style={styles.text}>
                    You can change a few settings using the left menu...
                </Text>
            </View>
            <View style={[styles.startView, styles.actionsView]}>
                <Button title="Start"
                        onPress={onStart} />
            </View>
        </View>
    );
};


export default HomeScreen;
