import React from "react";

function ScoreBoard(props){
    return (
        <div className="scoreboard-container">
            <h2 className="scoreboard-title">Circles dropped</h2>
            <ul className="scoreboard-list">
                {Object.entries(props.points).map(([player, score]) => (
                    <li key={player} className="scoreboard-item">
                        <span className="player-name">{player}:</span>
                        <span className="player-score">{score}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ScoreBoard