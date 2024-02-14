import React from "react";
import * as Constants from "./Constants";
import mrRandom from "./images/mrrandom.jpg"
import connectBot from "./images/connect4bot.jpg"
import twoPlayer from "./images/2player_v1.jpg"
import twoPlayer2 from "./images/2player_v2.jpg"




class OpponentChoose extends React.Component{
    render() {
        return(
            <div id={"opponent-selector-container"}>
                <div className={"opponent-container"} onClick={() => this.props.startGame(Constants.TWO_PLAYER)}>
                    <img src={twoPlayer2+""} alt=""/><p>2 player </p></div>
                <div className={"opponent-container"} onClick={() => this.props.startGame(Constants.MR_RANDOM)}>
                    <img src={mrRandom+""} alt="mrRandom"/> <p>mr. random</p></div>
                <div className={"opponent-container"} onClick={() => this.props.startGame(Constants.CONNECT_FOUR_BOT)} >
            <img src={connectBot+""} alt="connect4bot"/>
            <p>connect4bot</p></div>
            </div>
        )
    }

}

export default OpponentChoose