import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
  return (
    <button className={props.name} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          name={this.props.winingSequence.includes(i) ? "winner-square" : "square"}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      );
    }

    createBoard() {
      let board = [];
      let index = 0;
      for (let i = 0; i < this.props.size; i++) {
        let squares = [];
        for (let j = 0; j < this.props.size; j++) {
          squares.push(this.renderSquare(index));
          index++;
        }
        board.push(<div className="board-row">{squares}</div>);
      }
      return <div>{board}</div>;
    }
  
    render() {
      return this.createBoard();
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          number: 0
        }],
        stepNumber: 0,
        xIsNext: true,
        isAscendingOrder: true,
      }
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
      let history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      if (!this.state.isAscendingOrder) {
        history = history.slice().reverse()
      }

      const moves = history.map((step, move) => {
        const desc = step.number > 0 ?
          'Go to move #' + step.number + "(" + step.row + "," + step.col + ")":
          'Go to game start';
        return (
          <li key={move}>
            <button  
              className={(this.state.stepNumber === step.number ? "currently-selected-button" : "regular-button")} 
              onClick={() => this.jumpTo(step.number)}>{desc}</button>
          </li>
        );
      })

      let status;
      if (winner) {
        status = 'Winner: ' + winner.symbol;
      } else if (!areFreeSquaresAvailable(current.squares)) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              size={3}
              winingSequence={winner ? winner.sequence : [-1, -1, -1]}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
             />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.handleOrder()}>
              {this.state.isAscendingOrder ? "sort descending" : "sort ascending"}
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }

    handleOrder() {
      this.setState({isAscendingOrder: !this.state.isAscendingOrder});
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const row = Math.floor(i / 3);
      const col = i % 3;
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          row: row,
          col: col,
          number: current.number + 1,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
  }

  
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function areFreeSquaresAvailable(squares) {
    return squares.some(square => square === null);
  }

  function getWininingCombinations() {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  function calculateWinner(squares) {
    const lines = getWininingCombinations();

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {symbol: squares[a], sequence: lines[i]};
      }
    }
    return null;
  }
  