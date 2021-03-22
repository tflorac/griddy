
import React, { useRef, useState } from "react";
import {
    Button,
    StatusBar,
    StyleSheet,
    Text,
    useWindowDimensions,
    Vibration,
    View
} from "react-native";

import { GameEngine } from "react-native-game-engine";

import { STATES } from "./constants";
import { baseX, baseY, cellSize, getCells } from "./Cell";
import { useTimer } from "./Timer";
import Score from "./Score";

import config from "./config.json"


const LEVEL_SIZE = config.size;

let CELLS_COUNT = LEVEL_SIZE * LEVEL_SIZE;
let map = [...Array(CELLS_COUNT)];


/**
 * Level creator
 *
 * @returns {{value, selected: boolean}[]}
 */
const getLevel = () => {
    return Array.from({ length: CELLS_COUNT }, () => {
        return {
            value: Math.floor(Math.random() * 9) + 1,
            selected: false,
        };
    });
};

let engine = null;
let level = getLevel();
let entities = null;
let timer = null;

let selected = [];
let firstCell, lastCell;

let score, setScore;  // score state
let remaining, setRemaining;  // remaining time


/**
 * Main game component
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Game = () => {

    /**
     * Shuffle cells from provided level
     *
     * @param state
     */
    const shuffleLevel = (state) => {
        resetSelection(state);
        const newLevel = [...Array(CELLS_COUNT).keys()];
        newLevel.sort(() => Math.random() - 0.5);
        for (const [idx, val] of Object.entries(newLevel)) {
            newLevel[idx] = state[val];
        }
        for (const [idx, val] of Object.entries(newLevel)) {
            state[idx] = state[val];
        }
    };

    /**
     * Reset level selection
     *
     * @param state
     */
    const resetSelection = (state) => {
        for (const idx of map.keys()) {
            state[idx].cell.selected = false;
        }
        selected.splice(0, selected.length);
        firstCell = null;
        lastCell = null;
    };

    /**
     * Get linear position from given coordinates
     *
     * @param x: column
     * @param y: row
     * @returns {*}
     */
    const getCellPos = (x, y) => {
        return (y * LEVEL_SIZE) + x;
    };

    /**
     * Get cell matching given screen coordinates
     *
     * @param x: x screen position
     * @param y: y screen position
     * @returns {null|number}
     */
    const getCellAt = (x, y) => {
        const col = Math.floor((x - baseX) / cellSize);
        const row = Math.floor((y - baseY) / cellSize);
        if ((col >= 0) && (col < LEVEL_SIZE) && (row >= 0) && (row < LEVEL_SIZE)) {
            return (row * LEVEL_SIZE) + col;
        }
        return null;
    };

    /**
     * Start touch event handler
     *
     * @param state
     * @param touches
     * @returns {*}
     * @constructor
     */
    const SelectFirstCell = (state, { touches }) => {
        if ((runningMode !== STATES.RUNNING) || !state) {
            return state;
        }
        touches.filter(x => x.type === "start").forEach(t => {
            resetSelection(state);
            firstCell = getCellAt(t.event.pageX, t.event.pageY);
            if (firstCell !== null) {
                state[firstCell].cell.selected = true;
                selected.push(firstCell);
            }
        });
        return state;
    };

    /**
     * Move touch event handler
     *
     * @param state
     * @param touches
     * @returns {*}
     * @constructor
     */
    const SelectNextCell = (state, { touches }) => {
        if ((runningMode !== STATES.RUNNING) || !state) {
            return state;
        }
        touches.filter(x => x.type === "move").forEach(t => {
            lastCell = getCellAt(t.event.pageX, t.event.pageY);
            if ((firstCell !== null) && (lastCell !== null) && (lastCell !== firstCell)) {
                if ((state[lastCell].cell.selected !== true) &&
                    ((lastCell === firstCell - 1) ||
                        (lastCell === firstCell + 1) ||
                        (lastCell === firstCell - LEVEL_SIZE) ||
                        (lastCell === firstCell + LEVEL_SIZE)) &&
                    (Math.abs(state[lastCell].cell.value - state[firstCell].cell.value) < 2)) {
                    state[lastCell].cell.selected = true;
                    selected.push(lastCell);
                    firstCell = lastCell;
                }
            }
        });
        return state;
    };

    /**
     * Remove empty cells from given column
     *
     * @param state
     * @param col
     */
    const packColumn = (state, col) => {
        for (const row of [...Array(LEVEL_SIZE).keys()].reverse()) {
            const pos = getCellPos(col, row);
            while (state[pos].cell === null) {
                for (const idx of [...Array(row+1).keys()].reverse()) {
                    const target = getCellPos(col, idx);
                    if (idx === 0) {
                        if (state[target].cell === null) {
                            state[target].cell = {
                                value: Math.floor(Math.random() * 9) + 1,
                                selected: false
                            }
                        }
                    } else {
                        state[target].cell = state[target - LEVEL_SIZE].cell;
                        state[target - LEVEL_SIZE].cell = null;
                    }
                }
            }
        }
    };

    /**
     * End move touch event handler
     *
     * @param state
     * @param touches
     * @returns {*}
     * @constructor
     */
    const SelectLastCell = (state, { touches }) => {
        if ((runningMode !== STATES.RUNNING) || !state) {
            return;
        }
        touches.filter(x => x.type === "end").forEach(t => {
            if (selected.length > 1) {
                let delta = 0;
                for (const [idx, cell] of Object.entries(selected)) {
                    delta += (state[cell].cell.value * (parseInt(idx) + 1));
                    state[cell].cell = null;
                }
                setScore(score + delta);
                for (const col of [...Array(LEVEL_SIZE).keys()]) {
                    packColumn(state, col);
                }
                selected.splice(0, selected.length);
            } else {
                resetSelection(state);
            }
        });
        return state;
    };

    /**
     * Pause or resume game engine
     */
    const pauseGame = () => {
        timer.pause();
        setRunningMode(STATES.PAUSED);
    };

    /**
     * Restart game
     */
    const resumeGame = () => {
        timer.resume();
        setRunningMode(STATES.RUNNING);
    };

    /**
     * Current level end
     */
    const endGame = () => {
        resetSelection(entities);
        timer.clear();
        setRunningMode(STATES.FINISHED);
        Vibration.vibrate(400);
    };

    /**
     * Create new game level
     */
    const newGame = () => {
        setScore(0);
        timer.clear();
        level = getLevel();
        entities = getCells(window, level);
        resetSelection(entities);
        if (engine.current) {
            engine.current.swap(entities);
        }
        timer.start();
        setRunningMode(STATES.RUNNING);
    };


    /**
     * Main component features initialization
     */

    let [runningMode, setRunningMode] = useState(STATES.RUNNING);

    [score, setScore] = useState(0);
    [remaining, setRemaining] = useState(config.duration);

    const window = useWindowDimensions();
    const styles = StyleSheet.create({
        container: {
            backgroundColor: "#303030",
        },
        timerView: {
            position: 'absolute',
            flex: 1,
            width: '60%',
            left: 10,
            bottom: 60
        },
        timer: {
            color: '#fff',
            fontFamily: 'Syne Mono',
            fontSize: 16
        },
        timerEnding: {
            color: 'red'
        },
        buttonsView: {
            position: 'absolute',
            flex: 1,
            width: '30%',
            left: window.width - 150,
            bottom: 50
        },
        pauseButton: {},
        gameOver: {
            position: 'absolute',
            left: 50,
            top: (window.height / 2) - 50,
            width: window.width,
            color: '#7bde18',
            fontSize: 60,
            fontWeight: 'bold',
            transform: [{
                rotate: '-20deg'
            }]
        }
    });

    if (entities === null) {
        entities = getCells(window, level);
    }

    engine = useRef();
    timer = useTimer(endGame, remaining * 1000, setRemaining);

    switch (runningMode) {
        case STATES.RUNNING:
            return (
                <>
                    <StatusBar hidden={true} />
                    <GameEngine style={styles.container}
                                ref={engine}
                                running={true}
                                entities={entities}
                                systems={[
                                    SelectFirstCell,
                                    SelectNextCell,
                                    SelectLastCell
                                ]}>
                        <Score score={score} />
                        <View style={styles.timerView}>
                            <Text style={[
                                styles.timer,
                                remaining < 10 ? styles.timerEnding : {}
                            ]}>Time left: {remaining}</Text>
                        </View>
                        <View style={styles.buttonsView}>
                            <Button style={styles.pauseButton}
                                    onPress={pauseGame}
                                    title="Pause" />
                        </View>
                    </GameEngine>
                </>
            );

        case STATES.PAUSED:
            return (
                <>
                    <StatusBar hidden={true} />
                    <Score score={score} />
                    <View style={styles.timerView}>
                        <Text style={[
                            styles.timer,
                            remaining < 10 ? styles.timerEnding : {}
                        ]}>Time left: {remaining}</Text>
                    </View>
                    <View style={styles.buttonsView}>
                        <Button style={styles.pauseButton}
                                onPress={resumeGame}
                                title="Resume" />
                    </View>
                </>
            );

        case STATES.FINISHED:
            return (
                <>
                    <StatusBar hidden={true} />
                    <GameEngine style={styles.container}
                                ref={engine}
                                running={false}
                                entities={entities}>
                        <Score score={score} />
                        <Text style={styles.gameOver}>Game over</Text>
                        <View style={styles.buttonsView}>
                            <Button style={styles.pauseButton}
                                    onPress={newGame}
                                    title="New game" />
                        </View>
                    </GameEngine>
                </>
            );
    }

};

export default Game;
