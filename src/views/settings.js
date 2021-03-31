
import React, { useEffect } from "react";
import { Alert, Button, Text, useColorScheme, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";

import { DARK_STYLE, DEFAULT_STYLE } from "../styles";
import { settings } from "../settings";


/**
 * Settings view
 *
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
const SettingsView = ({navigation}) => {

    const scheme = useColorScheme();
    const styles = scheme === 'dark' ? DARK_STYLE : DEFAULT_STYLE;

    useEffect(() => {
        return navigation.addListener('state', async () => {
            try {
                await AsyncStorage.setItem('@griddy/settings', JSON.stringify(settings));
            } catch(exc) {
                Alert("An error occurred!",
                    `Can't save settings: ${exc}`);
            }
        });
    }, [navigation]);

    return (
        <View style={styles.innerPage}>
            <View style={styles.pageView}>
                <View style={styles.sliderHead}>
                    <Text style={styles.text}>Grid size</Text>
                </View>
                <View style={styles.slider}>
                    <Slider value={settings.size}
                            minimumValue={5}
                            maximumValue={12}
                            step={1}
                            onValueChange={(value) => {
                                settings.size = Math.round(value);
                            }} />
                </View>
                <View style={styles.sliderText}>
                    {[...Array(8)].map((val, idx) => {
                        return (
                            <Text key={`size-${idx}`}
                                  style={[styles.text, styles.sliderTextItem]}>
                                {idx + 5}
                            </Text>
                        );
                    })}
                </View>
                <View style={styles.sliderHead}>
                    <Text style={styles.text}>Game duration (in seconds)</Text>
                </View>
                <View style={styles.slider}>
                    <Slider value={settings.duration}
                            minimumValue={30}
                            maximumValue={90}
                            step={10}
                            onValueChange={(value) => {
                                settings.duration = value;
                            }} />
                </View>
                <View style={styles.sliderText}>
                    {[...Array(7)].map((val, idx) => {
                        return (
                            <Text key={`duration-${idx}`}
                                  style={[styles.text, styles.sliderTextItem]}>
                                {(idx + 3) * 10}
                            </Text>
                        );
                    })}
                </View>
            </View>
            <View style={styles.actionsView}>
                <Button title="Back"
                        style={styles.actionButton}
                        onPress={() => navigation.navigate("Home")} />
            </View>
        </View>
    );
};

export default SettingsView;
