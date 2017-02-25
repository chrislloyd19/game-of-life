import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
  componentDidMount(){
    let moving = setInterval( () => {
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
      this.setState({board: newBoard});
		}, 1000);

    this.setState({moving: moving});
  }
  componentWillUnmount() {
    clearInterval(this.state.moving);
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
