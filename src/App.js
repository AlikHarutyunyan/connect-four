import './App.css';
import React from "react";
import {GameBoard} from "./GameBoard";
import StartMenu from "./StartMenu";
import * as Constants from "./Constants";
import OpponentChoose from "./OpponentChoose";

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
      opponentChooseScreen:false
  }

  changeBoardSize = (event) => {
      let val = isNaN(+event.target.value) ? 0:event.target.value
      val = val <=10 && val >= 6 ? val : 0;
      if(val===0) return;

      this.setState({
          boardSize : val,
          gameArray : this.create2dArray(val)
      })
  }

  handleOpponentChoose = (selected) => {
      if(selected === Constants.CONNECT_FOUR_BOT && this.state.boardSize !== 7+""){
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
     startGame = () =>{
      this.setState({
          gameStarted:true,
          moveAvailable:true
      })
    }

    nextScreen = () =>{
        this.setState({
            opponentChooseScreen:true
        })
    }

    handleGameOver = (column, row,isBot,botColumn,botRow) => {
      let result;
        if(botColumn === undefined){
            result = this.checkForWinner(column, row, false);
        }else{
            result = this.checkForWinner(column, row, false) || this.checkForWinner(botColumn,botRow,true);
        }
        this.setState({
          gameOver: result,
          moveAvailable:!result
      })
    }

    checkForWinner = (column, row, isBot) =>{
        return this.checkForVerticalWinner(column, row, isBot) || this.checkForHorizontalWinner(column, row, isBot)
            || this.checkForDiagonalWinner(column, row, isBot);
    }

    checkForVerticalWinner = (column, row,isBot) => {
        let count = 0;
        const num = isBot ? !this.state.isFirstPlayer ? 1 : 2 : this.state.isFirstPlayer ? 1 : 2;
        for (let i = row; i<this.state.gameArray[column].length; i++) {
            count = this.updateCountSequence(column,i,num,count,isBot)
            if(count === Constants.WINNING_COMBO){
                console.log("vertical")
                return true
            }
        }
        return false;
    }

    checkForHorizontalWinner = (column, row,isBot) => {
      let count = 0;
      const num = isBot ? !this.state.isFirstPlayer ? 1 : 2 : this.state.isFirstPlayer ? 1 : 2;
        for (let j = 0; j < this.state.gameArray.length; j++) {
            count = this.updateCountSequence(j,row,num,count,isBot)
            if(count === Constants.WINNING_COMBO){
                console.log("horizontal")
                return true
            }
        }
        return false;
    }

    checkForDiagonalWinner = (column, row,isBot) => {
        let count = 0;
        const num = isBot ? !this.state.isFirstPlayer ? 1 : 2 : this.state.isFirstPlayer ? 1 : 2;
        let newRow = row - column;
        let newColumn = 0;
        if(column > row){
            newColumn = column - row;
            newRow = 0;
        }
        while(newColumn !== this.state.gameArray.length && newRow !== this.state.gameArray.length){
            count = this.updateCountSequence(newColumn,newRow,num,count,isBot);
            if(count === Constants.WINNING_COMBO){
                console.log("diagonal1")
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
            count = this.updateCountSequence(newColumn,newRow,num,count,isBot);
            if(count === Constants.WINNING_COMBO){
                console.log("diagonal2")
                return true;
            }
            newColumn--;
            newRow++;
        }
        return false;
    }

    updateCountSequence = (newColumn, newRow, num, count,isBot) =>{
        if(this.state.gameArray[newColumn][newRow] === num){
            count++;
            if(count === 3){
                this.setState({
                    winner: isBot? !this.state.isFirstPlayer ? 1 : 2 : this.state.isFirstPlayer ? 1 : 2
                })
                return 3;
            }else{
                return count;
            }
        }
        return 0;
    }



    handleGameArrayUpdate = (updatedGameArray,column,row) => {
        if(this.state.opponent === Constants.MR_RANDOM || this.state.opponent === Constants.CONNECT_FOUR_BOT){
            this.setState({
                gameArray: updatedGameArray,
            })
        }else{
            this.setState({
                gameArray: updatedGameArray,
                isFirstPlayer : !this.state.isFirstPlayer
            });
        }
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
      console.log("got here3" + this.state.isFirstPlayer)
      const winner =  <div id={"game-over-container"}> {this.state.winner === 1? "RED WON!" : "YELLOW WON!"} </div>;
      const divs = <GameBoard myBoardSize = {this.state.boardSize}
                              gameArray={this.state.gameArray}
                              onGameArrayUpdate={this.handleGameArrayUpdate}
                              moveAvailable={this.state.moveAvailable}
                              isFirstPlayer={this.state.isFirstPlayer}
                              handleGameOver={this.handleGameOver}
                              toggleMoves ={this.toggleMoves}
                              opponent = {this.state.opponent}/>;
    //console.log(this.state.gameArray)
      return (
        <div>
            {!this.state.gameStarted && !this.state.opponentChooseScreen &&
                <StartMenu boardSize={this.state.boardSize} changeBoardSize={this.changeBoardSize}
                   handleKeyDown={this.handleKeyDown} nextScreen={this.nextScreen} />};
            {this.state.opponentChooseScreen && <OpponentChoose startGame={this.handleOpponentChoose} />}

          <div  className={"game-board"}>
              { divs}
          </div>
            {this.state.gameOver && winner}
            {(this.state.opponentChooseScreen||this.state.gameStarted) && <button id="restart-button" onClick={this.handleGameRestart}>Restart</button>}
        </div>


    );
  }

}


export default App;
