import React from "react";
import { StyleSheet, Text, View } from "react-native";

import config from "./config.json";


const LEVEL_SIZE = config.size;

let cellSize, baseX, baseY;


export const getCells = (window, level) => {

    const { height, width } = window;

    cellSize = Math.floor((Math.min(width, height) - 20) / LEVEL_SIZE);

    const PANEL_SIZE = cellSize * LEVEL_SIZE;
    baseX = (width - PANEL_SIZE) / 2;
    baseY = (height - PANEL_SIZE) / 2;

    const styles = StyleSheet.create({
        cell: {
            position: "absolute",
            width: cellSize - 2,
            height: cellSize - 2,
            margin: 2,
            borderWidth: 2,
            borderColor: "#b50000",
            backgroundColor: "#542929",
            borderRadius: 5
        },
        selected: {
            borderColor: "#00b500",
            backgroundColor: "#295429",
        },
        text: {
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
        },
    });

    const Cell = ({ position, cell }) => {
        return (
            <View style={[styles.cell, cell && cell.selected && styles.selected || {},
                { left: position[0], top: position[1] }]}>
                <Text adjustFontSizeToFit={true}
                      allowFontScaling={true}
                      numberOfLines={1}
                      style={styles.text}>{cell && cell.value}</Text>
            </View>
        );
    };

    const result = {};
    for (const [idx, value] of Object.entries(level)) {
        const x = baseX + (idx % LEVEL_SIZE) * cellSize;
        const y = baseY + Math.floor(idx / LEVEL_SIZE) * cellSize;
        result[idx] = {
            id: parseInt(idx),
            position: [x, y],
            cell: value,
            renderer: <Cell />,
        };
    }
    return result;
};

export { cellSize, baseX, baseY };
