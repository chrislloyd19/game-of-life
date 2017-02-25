import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { Button } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';

let inBounds = (index, length) => {
  return index > -1 && index < length;
}

let isRightBorder = (index, width) => {
  return (index + 1) % width === 0;
}

let isLeftBorder = (index, width) => {
  return index % width === 0;
}

let numberLiveNeighbors = (board, index, width) => {
  let total = 0;
  let length = board.length;

  if(inBounds(index + 1, length) && !isRightBorder(index, width) && board[index + 1] === 1) {
    total++;
  }

  if (inBounds(index - 1, length) && !isLeftBorder(index, width) && board[index - 1] === 1) {
    total++;
  }

  if (inBounds(index + width, length) && board[index + width] === 1) {
    total++;
  }

  if (inBounds(index - width, length) && board[index - width] === 1) {
    total++;
  }

  if(inBounds(index + width + 1, length) && !isRightBorder(index, width) && board[index + width + 1] === 1) {
    total++;
  }

  if(inBounds(index + width - 1, length) && !isLeftBorder(index, width) && board[index + width - 1] === 1) {
    total++;
  }

  if (inBounds(index - width + 1, length) && !isRightBorder(index, width) &&  board[index - width + 1] === 1) {
    total++;
  }

  if (inBounds(index - width - 1, length) && !isLeftBorder(index, width) && board[index - width - 1] === 1) {
    total++;
  }

  return total;
}

let getRandomCell = () => {
  return Math.random() * 100 < 83 ? 0 : 1;
}

let getInitialGameboard = (height, width) => {
  let board = [];
  for(let i = 0; i < height*width; i++) {
    board.push(getRandomCell());
  }
  return board;
}

const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 100;
const INITIAL_BOARD = getInitialGameboard(BOARD_HEIGHT, BOARD_WIDTH);

const Row = (props) => {
  let cells = props.cells.map((cell) => {
    return (
      <div
        className={cell.value === 0 ? "cell empty" : "cell alive"}
        onClick={() => {props.toggleCell(cell.index)}}
        >
      </div>
    )
  });

  return (
    <div className="gameBoardRow">
      {cells}
    </div>
  )
}

const Gameboard = (props) => {
  let board = props.board.reduce((rows, cell, index) => {
    if(index % props.width === 0) {
      rows.push([]);
    }

    let cellObject = {index: index, value: cell}

    rows[Math.floor(index/props.width)].push(cellObject);

    return rows;
  }, []).map((row) => {
      return (
        <Row
          cells={row}
          toggleCell={props.toggleCell}
        />
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
    this.state = {board: INITIAL_BOARD, height: BOARD_HEIGHT, width: BOARD_WIDTH, ticks: 0};

    this.tick = this.tick.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.toggleCell = this.toggleCell.bind(this);
  }
  toggleCell(index) {
    let newBoard = this.state.board;
    newBoard[index] === 0 ? newBoard[index] = 1 : newBoard[index] = 1;
    this.setState({board: newBoard});
  }
  tick() {
    let board = this.state.board;
    let width = this.state.width;
    let newBoard = this.state.board.map(function(cell, index) {
      let liveNeighbors = numberLiveNeighbors(board, index, width);

      if(cell === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {
        return 1;
      }

      if(cell === 0 && liveNeighbors === 3) {
        return 1;
      }

      return 0;
    });
    this.setState({board: newBoard, ticks: this.state.ticks + 1});
  }
  startTicking() {
    this.stopTicking();
    let moving = setInterval( () => {this.tick()}, 500);
    this.setState({moving: moving});
  }
  stopTicking() {
    clearInterval(this.state.moving);
  }
  clearBoard() {
    this.stopTicking();
    let clearedBoard = this.state.board.map((cell) => {
      return 0;
    });
    this.setState({board: clearedBoard, ticks:0});
  }
  componentDidMount(){
    this.startTicking();
  }
  componentWillUnmount() {
    this.stopTicking();
  }
  render() {
    return (
      <div>
        <Gameboard
          board={this.state.board}
          height={this.state.height}
          width={this.state.width}
          toggleCell={this.toggleCell}
        />
        <p>Generations: {this.state.ticks}</p>
        <p>Click individual cells for custom setups (works best if simulation stopped).</p>
        <ButtonGroup className="controls">
          <Button
            bsStyle="success"
            onClick={this.startTicking}>
            Start
          </Button>
          <Button
            bsStyle="warning"
            onClick={this.stopTicking}>
            Stop
          </Button>
          <Button
            bsStyle="danger"
            onClick={this.clearBoard}>
            Clear
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="row">
        <h1>Game of Life</h1>
        <p>Complexity from an initial state and simple rules. See <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">here</a> for more info.</p>
        <GameOfLife />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
