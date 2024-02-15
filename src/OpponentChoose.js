import React from "react";
import * as Constants from "./Constants";
import mrRandom from "./images/mrrandom.jpg";
import connectBot from "./images/connect4bot.jpg";
import twoPlayer2 from "./images/2player_v2.jpg";

const opponents = [
    { id: Constants.TWO_PLAYER, image: twoPlayer2, name: "2 player", description: "Grab your friend and play a game of connect4 together" },
    { id: Constants.MR_RANDOM, image: mrRandom, name: "Mr. Random", description: "Mr.Random doesn't even think about his move, he will immediately make his move randomly after yours" },
    { id: Constants.CONNECT_FOUR_BOT, image: connectBot, name: "Connect4Bot", description: "Connect4Bot is a robot that was created to always win in 7x7 board, good luck beating him!" }
];

class OpponentChoose extends React.Component {
    state = {
        hoveredOpponent: null
    };

    handleHover = (id) => {
        const description = opponents.find(i => i.id === id).description;
        this.setState({ hoveredOpponent: description });
    };

    render() {
        return (
            <div id="opponent-selector-container">
                <div className={"opponent-list"}>
                    {opponents.map(opponent => (
                        <div onMouseOver={() => this.handleHover(opponent.id)} className="opponent-container" key={opponent.id} onClick={() => this.props.startGame(opponent.id)}>
                            <img src={opponent.image} alt={opponent.name} />
                            <p>{opponent.name}</p>
                        </div>
                    ))}
                </div>
                <div className={"opponent-description"}>
                    {this.state.hoveredOpponent && <p>{this.state.hoveredOpponent}</p>}
                </div>
            </div>
        );
    }
}

export default OpponentChoose;
