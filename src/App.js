import './App.css';
import React from "react";
import {GameBoard} from "./GameBoard";
import StartMenu from "./StartMenu";
import * as Constants from "./Constants";
import OpponentChoose from "./OpponentChoose";
import ScoreBoard from "./ScoreBoard";

class App extends React.Component{
  state = {
      boardSize: "",
      gameArray : [],
      gameStarted : false,
      isFirstPlayer : true,
      gameOver:false,
      winner:null,
      opponent:null,
      moveAvailable:false,
      opponentChooseScreen:false,
      points : {
          firstPlayer: 0,
          secondPlayer: 0,
          mrRandom: 0,
          connect4Bot:0
      }
  }

  changeBoardSize = (event) => {
      let val = isNaN(+event.target.value) ? 0:event.target.value
      val = val <=Constants.MAX_BOARD_SIZE && val >= Constants.MIN_BOARD_SIZE ? val : 0;
      if(val===0) return;
      this.setState({
          boardSize : val,
          gameArray : this.create2dArray(val)
      })
  }

  handleOpponentChoose = (selected) => {
      if(selected === Constants.CONNECT_FOUR_BOT && this.state.boardSize !== Constants.CONNECT_FOUR_BOT_BOARD_SIZE+""){
          alert("The bot can only play on 7x7 board!")
      }else{
          this.setState({
              opponent:selected,
              opponentChooseScreen:false,
              gameStarted:true,
              moveAvailable:true
          })
      }
  }

   handleKeyDown = (event) => {
        event.preventDefault();
    };

  toggleMoves = (val) => {
      this.setState({
          moveAvailable:val
      })
  }

  create2dArray = (val) =>{
      const array = [];
      for (let i = 0; i < val; i++) {
          const row = [];
          for (let j = 0; j < val; j++) {
              row.push(null);
          }
          array.push(row);
      }
      return array;
  }

    nextScreen = () =>{
      if(this.state.boardSize !== "") {
          this.setState({
              opponentChooseScreen: true
          })
      }
    }

    handleGameOver = (column, row,isBot,botColumn,botRow) => {
        let result;
        if (botColumn === undefined) {
            result = this.checkForWinner(column, row, false);
        } else {
            result = this.checkForWinner(column, row, false) || this.checkForWinner(botColumn, botRow, true);

            setTimeout(() => {
                if (result && this.state.winner === Constants.FIRST_PLAYER) {
                    const arr = {...this.state.gameArray}
                    arr[botColumn][botRow] = null
                    this.setState({
                        gameArray: arr
                    })
                }
            },0)
        }
        this.setState({
            gameOver: result,
            moveAvailable: !result
        })
  }



    checkForWinner = (column, row, isBot) =>{
        const player = isBot ? !this.state.isFirstPlayer ? Constants.FIRST_PLAYER : Constants.SECOND_PLAYER : this.state.isFirstPlayer ? Constants.FIRST_PLAYER : Constants.SECOND_PLAYER;
        return this.checkForVerticalWinner(column, row, player) || this.checkForHorizontalWinner(column, row, player)
            || this.checkForDiagonalWinner(column, row, player);
    }

    checkForVerticalWinner = (column, row, player) => {
        let count = 0;
        for (let i = row; i<this.state.gameArray[column].length; i++) {
            count = this.updateCountSequence(column,i,player,count)
            if(count === Constants.WINNING_COMBO){
                return true
            }
        }
        return false;
    }

    checkForHorizontalWinner = (column, row, player) => {
        let count = 0;
        for (let j = 0; j < this.state.gameArray.length; j++) {
            count = this.updateCountSequence(j,row,player,count)
            if(count === Constants.WINNING_COMBO){
                return true
            }
        }
        return false;
    }

    checkForDiagonalWinner = (column, row, player) => {
        let count = 0;
        let newRow = row - column;
        let newColumn = 0;
        if(column > row){
            newColumn = column - row;
            newRow = 0;
        }
        while(newColumn !== this.state.gameArray.length && newRow !== this.state.gameArray.length){
            count = this.updateCountSequence(newColumn,newRow,player,count);
            if(count === Constants.WINNING_COMBO){
                return true;
            }
            newColumn++;
            newRow++;
        }
        let differenceFromEndForColumn = this.state.gameArray.length - column - 1;
        newColumn = column - 0 + differenceFromEndForColumn;
        newRow = row - differenceFromEndForColumn;
        count = 0;
        while(newColumn >= 0 && newRow !== this.state.gameArray.length){
            count = this.updateCountSequence(newColumn,newRow,player,count);
            if(count === Constants.WINNING_COMBO){
                return true;
            }
            newColumn--;
            newRow++;
        }
        return false;
    }

    updateCountSequence = (newColumn, newRow, player, count) =>{
        if(this.state.gameArray[newColumn][newRow] === player){
            count++;
            if(count === Constants.WINNING_COMBO){
                this.setState({
                    winner: player
                })
                if(player === Constants.FIRST_PLAYER && this.state.opponent !== Constants.TWO_PLAYER){
                    const isMrRandom = this.state.opponent === Constants.MR_RANDOM
                    this.setState(prevState => ({
                        points:{
                            firstPlayer:prevState.points.firstPlayer,
                            secondPlayer:prevState.points.secondPlayer,
                            mrRandom:isMrRandom ? prevState.points.mrRandom-1:prevState.state.points.mrRandom,
                            connect4Bot:isMrRandom ? prevState.points.connect4Bot:prevState.points.connect4Bot-1
                        }
                    }))
                }
                return Constants.WINNING_COMBO;
            }else{
                return count;
            }
        }
        return 0;
    }


    handleGameArrayUpdate = (updatedGameArray) => {
      const points = {...this.state.points}
      if(this.state.isFirstPlayer) {
           points.firstPlayer++;
      }
        if(this.state.opponent === Constants.MR_RANDOM || this.state.opponent === Constants.CONNECT_FOUR_BOT){
            this.setState({
                gameArray: updatedGameArray,
            })
            switch (this.state.opponent){
                case Constants.MR_RANDOM:{
                    points.mrRandom++;
                    break;
                }
                default:{
                    points.connect4Bot++;
                }
            }
        }else{
            if(!this.state.isFirstPlayer){
              points.secondPlayer++;
            }
            this.setState({
                gameArray: updatedGameArray,
                isFirstPlayer : !this.state.isFirstPlayer
            });
        }
        this.setState({
            points:points
        })
   };

  handleGameRestart = () =>{
      this.setState({
          boardSize: "",
          gameArray : [],
          gameStarted : false,
          isFirstPlayer : true,
          gameOver:false,
          winner:null,
          moveAvailable:false,
          opponent:null,
          opponentChooseScreen:false
      })
  }

  render() {
      const winner =  <div id={"game-over-container"}> {this.state.winner === Constants.FIRST_PLAYER? "RED WON!" : "YELLOW WON!"} </div>;
      return (
        <div>
            {!this.state.gameStarted && !this.state.opponentChooseScreen &&
                <StartMenu boardSize={this.state.boardSize} changeBoardSize={this.changeBoardSize}
                   handleKeyDown={this.handleKeyDown} nextScreen={this.nextScreen} />};
            {this.state.opponentChooseScreen && <OpponentChoose startGame={this.handleOpponentChoose} />}
          <div  className={"game-board"}>
              {<GameBoard myBoardSize = {this.state.boardSize}
                          gameArray={this.state.gameArray}
                          onGameArrayUpdate={this.handleGameArrayUpdate}
                          moveAvailable={this.state.moveAvailable}
                          isFirstPlayer={this.state.isFirstPlayer}
                          handleGameOver={this.handleGameOver}
                          toggleMoves ={this.toggleMoves}
                          opponent = {this.state.opponent}/>}
          </div>
            {this.state.gameOver && winner}
            {(this.state.opponentChooseScreen||this.state.gameStarted) && <button id="restart-button" onClick={this.handleGameRestart}>Restart</button>}
            <ScoreBoard points={this.state.points} />
        </div>
    );
  }
}

export default App;
