
import React, { useContext, useRef, useState } from "react";
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

import _ from "lodash";

import { STATES } from "../constants";
import { StylesContext } from "../styles";

import { baseX, baseY, cellSize, getCells } from "./cell";

import Timer from "../components/timer";
import { useTimer } from "./timer";

import Score from "../components/score";
import { addHighScore } from "./score";


/**
 * Level creator
 *
 * @returns {{value, selected: boolean}[]}
 */
const getLevel = (config) => {

    const LEVEL_SIZE = config.size;
    const CELLS_COUNT = LEVEL_SIZE * LEVEL_SIZE;

    return Array.from({ length: CELLS_COUNT }, () => {
        return {
            value: Math.floor(Math.random() * 9) + 1,
            selected: false,
        };
    });
};


/**
 * Global game variables
 */

let engine = null;
let level = null;
let entities = null;
let timer = null;

let selected = [];
let firstCell, lastCell;

let score, setScore;          // score state
let remaining, setRemaining;  // remaining time


/**
 * Main game components
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Game = ({config, onExit}) => {

    /**
     * Reset level selection
     *
     * @param state
     */
    const resetSelection = (state) => {
        for (const idx of config.map.keys()) {
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
        return (y * config.LEVEL_SIZE) + x;
    };

    /**
     * Get cell matching given screen coordinates
     *
     * @param x: x screen position
     * @param y: y screen position
     * @returns {null|number}
     */
    const getCellAt = (x, y) => {
        const size = config.LEVEL_SIZE;
        const col = Math.floor((x - baseX) / cellSize);
        const row = Math.floor((y - baseY) / cellSize);
        if ((col >= 0) && (col < size) && (row >= 0) && (row < size)) {
            return (row * size) + col;
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
            const size = config.LEVEL_SIZE;
            lastCell = getCellAt(t.event.pageX, t.event.pageY);
            if ((firstCell !== null) && (lastCell !== null) && (lastCell !== firstCell)) {
                if ((state[lastCell].cell.selected !== true) &&
                    ((lastCell === firstCell - 1) ||
                        (lastCell === firstCell + 1) ||
                        (lastCell === firstCell - size) ||
                        (lastCell === firstCell + size)) &&
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
        const size = config.LEVEL_SIZE;
        for (const row of [...Array(size).keys()].reverse()) {
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
                        state[target].cell = state[target - size].cell;
                        state[target - size].cell = null;
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
                const size = config.LEVEL_SIZE;
                let delta = 0;
                for (const [idx, cell] of Object.entries(selected)) {
                    delta += (state[cell].cell.value * (parseInt(idx) + 1));
                    state[cell].cell = null;
                }
                setScore(score + delta);
                for (const col of [...Array(size).keys()]) {
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
     * Pause game engine
     */
    const pauseGame = () => {
        timer.pause();
        setRunningMode(STATES.PAUSED);
    };

    /**
     * Restart paused game
     */
    const resumeGame = () => {
        timer.resume();
        setRunningMode(STATES.RUNNING);
    };

    /**
     * Current level end
     */
    const endGame = () => {
        addHighScore(config.size, config.duration, score);
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
        setRemaining(config.duration);
        timer.clear();
        level = getLevel(config);
        entities = getCells(window, level, styles, config);
        resetSelection(entities);
        if (engine.current) {
            engine.current.swap(entities);
        }
        timer.start();
        setRunningMode(STATES.RUNNING);
    };

    /**
     * Exit current game level
     */
    const exitGame = () => {
        setScore(0);
        timer.clear();
        level = null;
        entities = null;
        setRunningMode(STATES.FINISHED);
        onExit();
    };


    /**
     * Main components features initialization
     */

    const window = useWindowDimensions();
    const styles = StyleSheet.create(
        _.merge({}, useContext(StylesContext), {
            gameOver: {
                top: (window.height / 2) - 60,
                left: window.width / 6,
                width: window.width,
                fontSize: window.width / 8
            }
        })
    );

    engine = useRef();

    if (level === null) {
        level = getLevel(config);
    }
    if (entities === null) {
        entities = getCells(window, level, styles, config);
    }

    let [runningMode, setRunningMode] = useState(STATES.RUNNING);

    [remaining, setRemaining] = useState(config.duration);
    [score, setScore] = useState(0);

    timer = useTimer(endGame, config.duration * 1000, remaining * 1000, setRemaining);

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
                        <Timer remaining={remaining} />
                        <View style={styles.buttonsView}>
                            <View style={styles.button}>
                                <Button onPress={pauseGame}
                                        title="Pause" />
                            </View>
                            <View style={styles.button}>
                                <Button onPress={exitGame}
                                        title="Exit" />
                            </View>
                        </View>
                    </GameEngine>
                </>
            );

        case STATES.PAUSED:
            return (
                <>
                    <StatusBar hidden={true} />
                    <Score score={score} />
                    <Timer remaining={remaining} />
                    <View style={styles.buttonsView}>
                        <View style={styles.button}>
                            <Button onPress={resumeGame}
                                    title="Resume" />
                        </View>
                        <View style={styles.button}>
                            <Button onPress={exitGame}
                                    title="Exit" />
                        </View>
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
                            <View style={styles.button}>
                                <Button onPress={newGame}
                                        title="Replay" />
                            </View>
                            <View style={styles.button}>
                                <Button onPress={exitGame}
                                        title="Exit" />
                            </View>
                        </View>
                    </GameEngine>
                </>
            );
    }
};

export default Game;
