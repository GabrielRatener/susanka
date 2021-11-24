
import { Button, Divider, Box } from '@mui/material'
import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import SudokuGrid from './components/SudokuGrid';
import { emptySudoku, stringToSudoku } from './utils/transform';
import { solve } from './utils/solve';
import sudokuLevels from "./utils/sudoku-db";
import { pt, Sudoku, SudokuSolution } from './utils/sudoku';

const levels = ["Easy", "Intermediate", "Hard", "Evil"];
const empty = emptySudoku();

function App() {
  const [rawSudoku, setRawSudoku] = useState(empty);
  const [level, setLevel] = useState(0);

  const displayRandom = () => {
    const collection = sudokuLevels[level];
    const string = collection[Math.floor(collection.length * Math.random())];
    const rawSudoku = stringToSudoku(string);

    setRawSudoku(rawSudoku);
  }

  const solveSudoku = () => {
    const sudoku = new Sudoku(rawSudoku);
    const solution = solve(sudoku) as SudokuSolution;

    setRawSudoku(solution.toRawArray());
  }

  const updateSudoku = (x: number, y: number, value: number) => {
    const index = pt(x, y);
    const newRawSudoku = [...rawSudoku];

    newRawSudoku[index] = value;

    setRawSudoku(newRawSudoku);
  }

  const clearBoard = () => {
    setRawSudoku(emptySudoku);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>¡Susanka!</h1>
      </header>
      <main>
        <div className="App-container">
          <div className="App-controls-container">
            {levels.map((levelName, levelOption) => (
              <Button
                disabled={levelOption === level}
                onClick={() => setLevel(levelOption)}
                key={levelOption}
              >
                {levelName}
              </Button>
            ))}
          </div>
          <div className="Grid-container">
            <SudokuGrid value={rawSudoku} onUpdate={(update) => updateSudoku(update.x, update.y, update.value)} />
          </div>
          <div className="App-controls-container">
            <Box display="flex" justifyContent="space-between">
              <div className="App-left-controls">
                <Button variant="outlined" onClick={() => displayRandom()}>
                  Random
                </Button>
                <Button variant="outlined" onClick={() => clearBoard()}>
                  Clear
                </Button>
              </div>
              <Button variant="contained" onClick={() => solveSudoku()}>
                Solve
              </Button>
            </Box>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
