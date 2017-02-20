import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let getRandomCell = () => {
  return Math.random() * 100 < 93 ? 0 : 1;
}

let getInitialGameboard = (height, width) => {
  let board = [];
  for(let i = 0; i < height*width; i++) {
    board.push(getRandomCell());
  }
  return board;
}

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 50;
const INITIAL_BOARD = getInitialGameboard(BOARD_HEIGHT, BOARD_WIDTH);

const Row = (props) => {
  let cells = props.cells.map((cell) => {
    return (
      <div className={cell === 0 ? "cell empty" : "cell alive"}></div>
    )
  });

  return (
    <div className="row">
      {cells}
    </div>
  )
}

const Gameboard = (props) => {
  let board = props.board.reduce((rows, cell, index) => {
    if(index % props.width === 0) {
      rows.push([]);
    }

    rows[Math.floor(index/props.width)].push(cell);

    return rows;
  }, []).map((row) => {
      return (
        <Row cells={row}/>
      )
    });

  return (
    <div>
      {board}
    </div>
  )
}

class GameOfLife extends React.Component {
  constructor(props) {
    super(props);
    this.state = {board: INITIAL_BOARD, height: BOARD_HEIGHT, width: BOARD_WIDTH};
  }
  render() {
    return (
      <Gameboard
        board={this.state.board}
        height={this.state.height}
        width={this.state.width} />
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <GameOfLife />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
