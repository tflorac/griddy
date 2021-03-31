
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import defaultSettings from "./config/config.json";

/**
 * Settings class
 */
class Settings {

    constructor(settings) {
        this.size = settings.size;
        this.duration = settings.duration;
    }

    merge(settings) {
        Object.assign(this, settings);
    }

    get LEVEL_SIZE() {
        return this.size;
    }

    get CELLS_COUNT() {
        return this.size * this.size;
    }

    get map() {
        return [...Array(this.CELLS_COUNT)];
    }
}


/**
 * Settings getter hook
 *
 * @returns {Settings}
 */

const settings = new Settings(defaultSettings);

const useSettings = () => {

    const getSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem("@griddy/settings");
            settings.merge(JSON.parse(stored));
        } catch (ex) {
        }
    };

    useEffect(async () => {
        await getSettings();
    }, []);

    return settings;
};


export { settings, useSettings };
