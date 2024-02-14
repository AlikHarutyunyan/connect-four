import React, { useState, useEffect } from 'react';
import * as Constants from "./Constants";
import {CONNECT_FOUR_BOT} from "./Constants";
import BestMoveFinder from "./BestMoveFinder";

function createGameBoard(props){
    const divs = [];
    for (let i = 0; i < props.myBoardSize; i++) {
        const childDivs = [];
        for (let j = 0; j < props.myBoardSize; j++) {
            if(props.gameArray[i][j] === 1){
                childDivs.push(<div onClick={()=>makeMove(props.gameArray,""+i+j,props)} className={`red-circle childDivs`} key={""+i+j}></div>);
            }else if(props.gameArray[i][j] === 2){
                childDivs.push(<div onClick={()=>makeMove(props.gameArray,""+i+j,props)} className={`yellow-circle childDivs`} key={""+i+j}></div>);
            }else{
                childDivs.push(<div onClick={()=>makeMove(props.gameArray,""+i+j,props)} className={`childDivs`} key={""+i+j}></div>);
            }
        }
        divs.push(<div className={"parentDiv"} key={i}> {childDivs} </div>);
    }
    console.log(props.gameArray)
    return divs;
}

function makeMove(arr, x, props) {
    props.toggleMoves(false)
    if (props.moveAvailable) {
        const updatedGameArray = [...arr];
        let column = x[0];
        let i = calculateRow(arr, column);
        let botColumn, botRow;

        console.log("column : " + column + " row: " + (i - 1))
        if (arr[column][i - 1] === null) {
            arr[column][i - 1] = props.isFirstPlayer ? 1 : 2;
                switch (props.opponent) {
                    case Constants.CONNECT_FOUR_BOT : {
                        const request = convert2dArrayToString(arr);
                        getBestMove(request).then(botColumn => {
                            botRow = calculateRow(arr, botColumn);
                            arr[botColumn][botRow - 1] = !props.isFirstPlayer ? 1 : 2;
                            props.onGameArrayUpdate(updatedGameArray, botColumn, botRow - 1);
                            props.toggleMoves(true)
                            props.handleGameOver(column, i - 1, false, botColumn, botRow - 1);
                        }).catch(error => {
                            // Handle error
                            console.error('Error getting best move:', error);
                        });
                        break;
                    }
                    case Constants.MR_RANDOM : {
                        botColumn = Math.floor(Math.random() * 6);//TODO make sure the column has space
                        botRow = calculateRow(arr, botColumn);
                        arr[botColumn][botRow - 1] = !props.isFirstPlayer ? 1 : 2;
                        props.onGameArrayUpdate(updatedGameArray, botColumn, botRow - 1);
                        props.toggleMoves(true)
                        props.handleGameOver(column, i - 1, false, botColumn, botRow - 1);
                        break;
                    }

                    default: {
                        props.onGameArrayUpdate(updatedGameArray, column, i - 1);
                        props.toggleMoves(true)
                        props.handleGameOver(column, i - 1, false, column, i - 1);
                        break;
                    }
                }
        }else{
            props.toggleMoves(true)
        }
    }
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
            console.log(move);
            return move;
        })
        .catch(error => {
            console.error('Error fetching best move:', error);
            throw error;
        });
};


const y = (x) => {
    alert("f")
    console.log(x)

}

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
        console.log("i is " + i + " and col is " + arr[column].length)
    }
    return i;
}

export  {createGameBoard as GameBoard}