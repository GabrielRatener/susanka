
import { Button, Box } from '@mui/material'
import { useState } from 'react';

import './App.css';
import SudokuGrid from './components/SudokuGrid';
import { emptySudoku, stringToSudoku } from './utils/transform';
import { solve } from './utils/solve';
import sudokuLevels from "./utils/sudoku-db";
import { pt, Sudoku, SudokuSolution } from './utils/sudoku';

const levels = ["Easy", "Intermediate", "Hard", "Evil"];
const empty = emptySudoku();

const buttonTextClasses = (active: boolean) => {
  const classes = ['Button-text'];

  if (active) {
    classes.push('Button-text-active');
  }

  return classes.join(' ');
}

function App() {
  const [originalSudoku, setOriginalSudoku] = useState(empty);
  const [rawSudoku, setRawSudoku] = useState(empty);
  const [level, setLevel] = useState(0);

  const displayRandom = () => {
    const collection = sudokuLevels[level];
    const string = collection[Math.floor(collection.length * Math.random())];
    const rawSudoku = stringToSudoku(string);

    setOriginalSudoku(rawSudoku);
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
    setOriginalSudoku(emptySudoku);
  }

  const resetSudoku = () => {
    setRawSudoku(originalSudoku);
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
                onClick={() => setLevel(levelOption)}
                key={levelOption}
              >
                <span className={buttonTextClasses(levelOption === level)}>{levelName}</span>
              </Button>
            ))}
          </div>
          <div className="Grid-container">
            <SudokuGrid
              value={rawSudoku}
              original={originalSudoku}
              onUpdate={(update) => updateSudoku(update.x, update.y, update.value)}
            />
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
                <Button variant="outlined" onClick={() => resetSudoku()}>
                  Reset
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
