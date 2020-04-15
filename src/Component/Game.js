import React, { Component } from 'react'
import Board from './Board'

const boardSize = 20;
const winSize = 5;
const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
];

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xIsNext: true,
            lastMove: null,
            moveCount: 0,
            history: [{
                squares: Array(boardSize * boardSize).fill(null),
            }],
            stepNumber: 0,
            isReverse: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.calculateWinner(current.squares, this.state.lastMove) || squares[i] != null) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            lastMove: i,
            moveCount: this.state.moveCount + 1,
            stepNumber: history.length,

        });
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

    calculateWinner(squares, lastMove) {
        if (lastMove == null)
            return null;

        let i, j;
        let checks = Array(directions.length).fill(true);
        let highlights = Array(directions.length);
        const lastMoveIndex = [Math.floor(lastMove / boardSize), lastMove % boardSize];

        for (i = 0; i < directions.length; i++)
            highlights[i] = Array();

        for (i = 1; i <= winSize - 1; i++) {
            for (j = 0; j < directions.length; j++) {
                if (!checks[j])
                    continue;

                let currentMoveIndex = [lastMoveIndex[0] + i * directions[j][0], lastMoveIndex[1] + i * directions[j][1]];
                let currentMove = currentMoveIndex[0] * boardSize + currentMoveIndex[1];
                if (!this.checkInBoard(currentMoveIndex) || squares[lastMove] !== squares[currentMove]) {
                    checks[j] = false;
                    continue;
                }

                highlights[j].push(currentMove);
            }
        }

        for (i = 0; i < directions.length; i += 2)
            if (highlights[i].length + highlights[i + 1].length + 1 >= winSize) {
                let winner = {};
                winner.player = squares[lastMove];
                winner.highlights = [lastMove];
                winner.highlights = winner.highlights.concat(highlights[i]);
                winner.highlights = winner.highlights.concat(highlights[i + 1]);
                return winner;
            }

        return null;
    }

    checkInBoard(index) {
        return index[0] >= 0 && index[0] < boardSize && index[1] >= 0 && index[1] < boardSize;
    }
    reverse(){
        this.setState({
            isReverse : !this.state.isReverse,
        })      
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        let moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';

            return (
              <li key={!move ? 1 : move + 1}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button> 
              </li>
            );
          });

        if(this.state.isReverse){
            moves = moves.reverse();
        }

        let status;
        let highlights = null;
        if (this.state.moveCount === boardSize * boardSize) {
            status = 'Draw';
        }
        else {
            const winner = this.calculateWinner(current.squares, this.state.lastMove);
            console.log(winner)

            if (winner && winner.player) {
                status = 'Winner: ' + winner.player;
                highlights = winner.highlights;
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className="row game">
                <div className="board-size">Board size: {boardSize}</div> 
                <div className="win-length">Rule: {winSize}</div>
                <div className="status">{status}</div>
                <div className="game-board">
                    <Board squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        highlights={highlights} />
                    <div className='action-btn'>
                        <ul style={{ margin: 0 }}>
                            <button onClick={() => this.reverse()}>Reverse history</button>
                        </ul>
                        <ol style={{ marginTop: 0 }}>{moves}</ol>
                    </div>
                </div> 
            </div>
        );
    }
}
