import React from 'react';
import * as Constants from "./Constants";

function createGameBoard(props){
    const divs = [];
    const createDiv = (i, j, className) => (
        <div onClick={() => makeMove(props.gameArray, "" + i + j, props)} className={className} key={"" + i + j}></div>
    );
    for (let i = 0; i < props.myBoardSize; i++) {
        const childDivs = [];
        for (let j = 0; j < props.myBoardSize; j++) {
            let className = "childDivs";
            if (props.gameArray[i][j] === Constants.FIRST_PLAYER) {
                className += " red-circle";
            } else if (props.gameArray[i][j] === Constants.SECOND_PLAYER) {
                className += " yellow-circle";
            }
            childDivs.push(createDiv(i, j, className));
        }
        divs.push(<div className={"parentDiv"} key={i}> {childDivs} </div>);
    }
    return divs;
}


const makeMove = (arr, x, props) => {
    props.toggleMoves(false)
    if (props.moveAvailable) {
        let column = x[Constants.COLUMN_INDEX];
        let i = calculateRow(arr, column);
        let botColumn;

        if (arr[column][i - 1] === null) {
            arr[column][i - 1] = props.isFirstPlayer ? Constants.FIRST_PLAYER : Constants.SECOND_PLAYER;
                switch (props.opponent) {
                    case Constants.CONNECT_FOUR_BOT : {
                        const request = convert2dArrayToString(arr);
                        getBestMove(request).then(botColumn => {
                            performUpdates(props,arr,column,i,botColumn,calculateRow(arr, botColumn))
                        }).catch(error => {
                            console.error('Error getting best move:', error);
                        });
                        break;
                    }
                    case Constants.MR_RANDOM : {
                        const freeColumnsArray = returnFreeColumns(arr);
                        botColumn = freeColumnsArray[Math.floor(Math.random() * freeColumnsArray.length)];
                        performUpdates(props,arr,column,i,botColumn,calculateRow(arr, botColumn))
                        break;
                    }

                    default: {
                        performUpdates(props,arr,column,i,undefined,undefined)
                        break;
                    }
                }
        }else{
            props.toggleMoves(true)
        }
    }
}

const returnFreeColumns = (arr) =>{
    const columnsWithFreeSpace = [];
    for (let columnIndex = 0; columnIndex < arr[0].length; columnIndex++) {
        let hasNull = false;
        for (let rowIndex = 0; rowIndex < arr.length; rowIndex++) {
            if (arr[columnIndex][rowIndex] === null) {
                hasNull = true;
                break;
            }
        }
        if (hasNull) {
            columnsWithFreeSpace.push(columnIndex);
        }
    }
    return columnsWithFreeSpace;
}

const performUpdates = (props,arr,col,row,botCol,botRow) => {
    if(botRow !== undefined){
        arr[botCol][botRow - 1] = !props.isFirstPlayer ? Constants.FIRST_PLAYER : Constants.SECOND_PLAYER;
    }
    props.onGameArrayUpdate(arr);
    props.toggleMoves(true)
    props.handleGameOver(col, row - 1, false, botCol, botRow - 1);
}

const getBestMove = (data) => {
    return fetch(`https://kevinalbs.com/connect4/back-end/index.php/getMoves?board_data=${data}&player=2`, {method: 'GET'})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(json => {
            let highestValue = -Infinity;
            let move = null;

            Object.entries(json).forEach(([key, value]) => {
                if (value > highestValue) {
                    highestValue = value;
                    move = parseInt(key);
                }
            });
            return move;
        })
        .catch(error => {
            console.error('Error fetching best move:', error);
            throw error;
        });
};

function convert2dArrayToString(array_2d){
    const resultString = [];
    for (let col = 0; col < array_2d[0].length; col++) {
        for (let row = 0; row < array_2d.length; row++) {
            const value = array_2d[row][col];
            resultString.push(value === null ? '0' : value);
        }
    }

    return resultString.join("")

}
function calculateRow(arr,column){
    let i = 0;
    while (arr[column][i] === null && i < arr[column].length) {
        i++;
    }
    return i;
}

export  {createGameBoard as GameBoard}