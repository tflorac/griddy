
import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * Add new high score
 *
 * @param size: level size
 * @param duration: level duration
 * @param score: level score
 */
const addHighScore = (size, duration, score) => {

    const store = async () => {
        let scores;
        try {
            scores = await AsyncStorage.getItem("@griddy/scores");
            scores = JSON.parse(scores) || [];
        } catch (exc) {
            scores = [];
        }
        scores.push({
            timestamp: new Date().getTime(),
            size: size,
            duration: duration,
            score: score,
        });
        scores.sort((x, y) => y.score - x.score);
        scores.splice(10, scores.length);
        await AsyncStorage.setItem("@griddy/scores", JSON.stringify(scores));
    };
    store();
};

export { addHighScore };
