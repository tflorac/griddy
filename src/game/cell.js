
import React  from "react";
import { StyleSheet, Text, View } from "react-native";

import _ from "lodash";


/**
 * Module exports
 */
let cellSize, baseX, baseY;

export { cellSize, baseX, baseY };


/**
 * Game entities getter
 *
 * @param window: current window dimensions
 * @param level: current level state
 * @param theme: current theme
 * @param config: current game configuration
 *
 * @returns {{}}
 */
export const getCells = (window, level, theme, config) => {

    const { height, width } = window;

    const LEVEL_SIZE = config.size;
    cellSize = Math.floor((Math.min(width, height) - 20) / LEVEL_SIZE);

    const PANEL_SIZE = cellSize * LEVEL_SIZE;
    baseX = (width - PANEL_SIZE) / 2;
    baseY = (height - PANEL_SIZE) / 2;

    const styles = StyleSheet.create(
        _.merge({}, theme, {
            cell: {
                width: cellSize - 2,
                height: cellSize - 2
            },
            cellText: {
                fontSize: cellSize / 2
            }
        })
    );

    /**
     * Cell renderer
     *
     * @param position: cell position
     * @param cell: cell entity
     * @returns {JSX.Element}
     * @constructor
     */
    const Cell = ({ position, cell }) => {

        return (
            <View style={[
                styles.cell,
                cell && cell.selected && styles.selectedCell || {},
                { left: position[0], top: position[1] }
            ]}>
                <Text adjustFontSizeToFit={true}
                      allowFontScaling={true}
                      numberOfLines={1}
                      style={[
                          styles.cellText,
                          cell && cell.selected && styles.selectedCellText || {}
                      ]}>{cell && cell.value}</Text>
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
