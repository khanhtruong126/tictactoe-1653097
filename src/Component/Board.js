import React, { Component } from "react";
import Square from './Square';

const boardSize = 20;

export default class Board extends Component {

    renderSquare(i, highlight) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={highlight}
            />
        );
    }

    renderBoard(highlights) {
        let i;
        let boardHighlights = Array(boardSize * boardSize).fill(false);
        if (highlights != null) {
            for (i = 0; i < highlights.length; i++)
                boardHighlights[highlights[i]] = true;
        }

        let board = [];
        for (i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(this.renderSquare(i * boardSize + j, boardHighlights[i * boardSize + j]));
            }
            board.push(<div className="board-row">{row}</div>);
        }
        return board;
    }

    render() {
        return (
            <div>
                {this.renderBoard(this.props.highlights)}
            </div>
        );
    }
   
}

