
import { createContext } from "react";

import _ from "lodash";


/**
 * Base stylesheets
 */

const BASE_STYLE = {
    appName: {
        fontSize: 35,
        fontFamily: 'Syne Mono',
        textAlign: 'center'
    },
    version: {
        fontSize: 20,
        textAlign: 'center'
    },
    author: {
        fontSize: 14,
        textAlign: 'center'
    },
    flex: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    innerPage: {
        padding: 20
    },
    iconView: {
        paddingLeft: 20
    },
    startView: {
        justifyContent: 'center'
    },
    spacedView: {
        justifyContent: 'space-around'
    },
    homeText: {
        paddingLeft: 30,
        paddingRight: 30
    },
    actionsView: {
        marginTop: 20,
        paddingLeft: 100,
        paddingRight: 100
    },
    pageView: {
        flexGrow: 1
    },
    icon: {},
    text: {},
    strong: {
        fontWeight: 'bold'
    },
    slider: {
        paddingLeft: 3,
        paddingRight: 3
    },
    sliderHead: {
        marginBottom: 20
    },
    sliderText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 20
    },
    sliderTextItem: {
        width: 20,
        textAlign: 'center'
    },
    score: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        top: 20
    },
    scoreText: {
        fontFamily: 'Syne Mono',
        fontSize: 25
    },
    cell: {
        position: "absolute",
        margin: 2,
        borderWidth: 2,
        borderRadius: 5
    },
    selectedCell: {
    },
    cellText: {
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: 'center'
    },
    timerView: {
        position: 'absolute',
        flex: 1,
        width: '40%',
        left: 20,
        bottom: 60
    },
    timer: {
        fontFamily: 'Syne Mono',
        fontSize: 16
    },
    timerEnding: {
        color: 'red'
    },
    buttonsView: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        left: '45%',
        width: '50%',
        bottom: 50
    },
    button: {
        flex: 1,
        marginLeft: 3,
        marginRight: 3
    },
    actionButton: {

    },
    pauseButton: {
        flex: 1
    },
    resumeButton: {
        flex: 1
    },
    stopButton: {
        flex: 1
    },
    newGameButton: {
        flex: 1
    },
    scoresHead: {

    },
    scoresHeadText: {

    },
    scoresItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5
    },
    scoresSize: {
        width: 40,
        textAlign: 'right'
    },
    scoresDuration: {
        width: 30,
        textAlign: 'right'
    },
    scoresScore: {
        width: 40,
        textAlign: 'right'
    },
    scoresDate: {
        flexGrow: 1
    },
    gameOver: {
        position: 'absolute',
        left: 50,
        fontSize: 60,
        fontWeight: 'bold',
        transform: [{
            rotate: '-20deg'
        }]
    }
};

export const DEFAULT_STYLE = _.merge({}, BASE_STYLE, {
    container: {
        backgroundColor: "#f3f3f3",
    },
    icon: {
        color: '#292929'
    },
    text: {
        color: '#292929'
    },
    score: {
        color: '#292929'
    },
    scoreText: {
        color: '#292929'
    },
    cell: {
        borderColor: "#542929",
        backgroundColor: "#fff"
    },
    selectedCell: {
        borderColor: "#295429",
        backgroundColor: "#295429",
    },
    cellText: {
        color: "#292929"
    },
    selectedCellText: {
        color: '#fff'
    },
    timer: {
        color: '#292929'
    },
    gameOver: {
        color: '#2740d4'
    }
});

export const DARK_STYLE = _.merge({}, BASE_STYLE, {
    container: {
        backgroundColor: "#212121",
    },
    icon: {
        color: '#fff'
    },
    text: {
        color: '#fff'
    },
    score: {
        color: '#fff'
    },
    scoreText: {
        color: '#fff'
    },
    cell: {
        borderColor: "#b50000",
        backgroundColor: "#542929"
    },
    selectedCell: {
        borderColor: "#00b500",
        backgroundColor: "#295429",
    },
    cellText: {
        color: "#fff"
    },
    selectedCellText: {
        color: '#fff'
    },
    timer: {
        color: '#fff'
    },
    gameOver: {
        color: '#7bde18'
    }
});

export const StylesContext = createContext();
