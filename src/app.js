/**
 * Griddy application
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from "react";
import type { Node } from "react";

import { StatusBar, useColorScheme, View } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTh } from "@fortawesome/free-solid-svg-icons";

import { DARK_STYLE, DEFAULT_STYLE, StylesContext } from "./styles";

import Game from "./game/level";
import { useSettings } from "./settings";

import HomeScreen from "./views/home";
import SettingsView from "./views/settings";
import HighScoresView from "./views/score";
import AboutView from "./views/about";


/**
 * Navigation drawer
 */
const Drawer = createDrawerNavigator();


/**
 * Main application
 *
 * @returns {JSX.Element}
 * @constructor
 */
const App: () => Node = () => {

    const scheme = useColorScheme();
    let theme = scheme === 'dark' ? DarkTheme : DefaultTheme;
    let styles = scheme === 'dark' ? DARK_STYLE : DEFAULT_STYLE;

    let [running, setRunning] = useState(false);

    /**
     * Menu header icon
     */
    const MenuHeaderIcon = () => {

        return (
            <View style={styles.iconView}>
                <FontAwesomeIcon style={styles.icon}
                                 icon={faTh} />
            </View>
        );
    };

    /**
     * Game start
     */
    const start = () => {
        setRunning(true);
    };

    /**
     * Fame stop
     */
    const stop = () => {
        setRunning(false);
    };

    /**
     * Main rendering
     */
    const settings = useSettings();

    if (running) {
        return (
            <StylesContext.Provider value={styles}>
                <Game config={settings} onExit={stop} />
            </StylesContext.Provider>
        );
    }

    return (
        <StylesContext.Provider value={styles}>
            <NavigationContainer theme={theme}>
                <StatusBar hidden={true} />
                <Drawer.Navigator>
                    <Drawer.Screen name="Home"
                                   options={{
                                       headerLeft: () => <MenuHeaderIcon />,
                                       headerTitle: "Griddy",
                                       headerShown: true
                                   }}>
                        {props => <HomeScreen {...props} onStart={start} />}
                    </Drawer.Screen>
                    <Drawer.Screen name="Settings"
                                   component={SettingsView}
                                   options={{
                                       headerLeft: () => <MenuHeaderIcon />,
                                       headerShown: true
                                   }} />
                    <Drawer.Screen name="High scores"
                                   component={HighScoresView}
                                   options={{
                                       headerLeft: () => <MenuHeaderIcon />,
                                       headerShown: true
                                   }} />
                    <Drawer.Screen name="About"
                                   component={AboutView}
                                   options={{
                                       headerLeft: () => <MenuHeaderIcon />,
                                       headerShown: true
                                   }} />
                </Drawer.Navigator>
            </NavigationContainer>
        </StylesContext.Provider>
    );
};

export default App;
