import React from "react";
import produce from "immer";
const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

function generateEmptyGrid() {
  let rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols)).fill(0));
  }
  return rows;
}

function Canvas() {
  const [grid, setGrid] = React.useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = React.useState(false);

  const runningRef = React.useRef();
  runningRef.current = running;
  //make sure this function is only created once
  const runSimulation = React.useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid(previousState => {
      return produce(previousState, newState => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                //do some stuff
                neighbors += previousState[newI][newK];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              //our grid position dies
              newState[i][k] = 0;
            } else if (previousState[i][k] === 0 && neighbors === 3) {
              newState[i][k] = 1;
            }
          }
        }
      });
    });

    //simulate
    setTimeout(runSimulation, 100);
  }, []);
  return (
    <React.Fragment>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
          setRunning(false);
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          let rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0))
            );
          }
          setGrid(rows);
        }}
      >
        random
      </button>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(${numCols},20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => {
            return (
              <div
                key={k}
                style={{
                  width: 20,
                  height: 20,

                  backgroundColor: grid[i][k] ? "pink" : undefined,
                  border: "1px solid black"
                }}
                onClick={() => {
                  //when the user clicks, set the current index to 1
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    return gridCopy;
                  });
                  setGrid(newGrid);
                }}
              />
            );
          })
        )}
      </div>
    </React.Fragment>
  );
}

export default Canvas;
