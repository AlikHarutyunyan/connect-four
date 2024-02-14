import React from 'react';

class StartMenu extends React.Component {
    render() {
        const { boardSize, changeBoardSize, handleKeyDown, nextScreen } = this.props;

        return (
            <div>
                <p id={"board-size-text"}>Choose the board size (from 6 to 10)</p>
                <div id={"board-size-button-container"}>
                <input
                    id="board-size-selector"
                    type="number"
                    min="6"
                    max="10"
                    value={boardSize}
                    onChange={changeBoardSize}
                    onKeyDown={handleKeyDown}
                />
                <button id="start-button" onClick={() => nextScreen(boardSize)}>Next</button>
            </div>
            </div>
        );
    }
}

export default StartMenu;