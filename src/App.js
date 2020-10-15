import React, { useEffect, useState, useCallback, useRef } from "react";
import './App.css';
import produce from 'immer'
// import { set } from "immer/dist/internal";

const numRows = 88
const numCols = 50

const opertaions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [1, 1],
  [1, -1]
]

const generateEmptyGrid = () => {
  const rows = []
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows
}


function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0
            opertaions.forEach(([x, y]) => {
              const newI = i + x
              const newJ = j + y
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
              }
            })
            if (neighbors < 2 || neighbors > 3){
              gridCopy[i][j] = 0
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1
            }
          }
        }
      })
    })
    // simulate
    setTimeout(runSimulation, 100)
  }, [])

  return (
    <div position='relative'>
      <button
        onClick={() => {
          setRunning(!running)
          if (!running) {
            runningRef.current = true
            runSimulation()
          }
        }}
      >{running ? 'stop' : 'start'}</button>
      <button onClick={() => {
        setGrid(generateEmptyGrid())
      }}>
        clear 
      </button>
      <button onClick={() => {
        const rows = []
        for (let i = 0; i < numRows; i++) {
          rows.push(Array.from(Array(numCols), () => (Math.random() > 0.9 ? 1 : 0)))
        }
        setGrid(rows)
      }}>
        random
      </button>
      <div
        style={{
          position: 'absolute',
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 10px)`
        }}>
        {grid.map((rows, i) =>
          rows.map((col, j) =>
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                })
                setGrid(newGrid)
              }}
              style={{
                width: 10,
                height: 10,
                backgroundColor: grid[i][j] ? undefined : 'black',
                // border: !grid[i][j] ? 'solid 1px black' : null,
                border: 'solid 1px black'
              }}
            />
          ))}
      </div>
      <div >
        {/* <img alt='d' height='1056px' width='500px' src='https://www.publicdomainpictures.net/pictures/220000/velka/rainbow-colors-background-1497250409c9l.jpg'/> */}
        {/* <img alt='d' height='1056px' width='500px' src='https://images.fastcompany.net/image/upload/w_1153,ar_16:9,c_fill,g_auto,f_auto,q_auto,fl_lossy/fc/3021148-poster-1280-trends.jpg'/> */}
        <img alt='d' height='1056px' width='500px' src='http://www.pptback.com/uploads/colors-rainbow-backgrounds-powerpoint.jpg'/>
      </div>
    </div>
  );
}

export default App;
