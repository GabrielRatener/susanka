
import { createPossibleValuesSet, SudokuSolution } from "./sudoku"
import { range, getFirstSetValue } from "./transform"

export const christmasBox = (value) => Math.floor(value / 3) * 3

export const solve = (sudoku) => {
  const solution = new SudokuSolution(sudoku);

  while (true) {
    const fillCount = solution.fillCount;

    fillInCells(solution)

    // if sudoku doesn't change or is solved we're done!
    if (fillCount === solution.fillCount || solution.isSolved) {
      break;
    }

    // TODO: solve sudoku
    // use solution.fillCell(x, y, value) to fill in values
    // use solution.at(x, y) to view values
    // use solution.isSolved() to see if sudoku is completely solved
  }

  return solution;
}

const fillInRows = (sudokuSolution) => {
  for (const y of range(0, 9)) {
    const possibleValues = createPossibleValuesSet();
    let emptyX = null, emptyY = null;

    for (const x of range(0, 9)) {
      if (sudokuSolution.at(x, y) !== 0) {
        possibleValues.delete(sudokuSolution.at(x, y));
      } else {
        if (emptyX !== null) { // we've seen an empty cell before so we give up on this row...
          break;
        } else {
          emptyX = x;
          emptyY = y;
        }
      }
    }

    if (possibleValues.size === 1) {
      sudokuSolution.fillCell(emptyX, emptyY, getFirstSetValue(possibleValues))
    }
  }
}

const fillInColumns = (sudokuSolution) => {
  for (const x of range(0, 9)) {
    const possibleValues = createPossibleValuesSet();
    let emptyX = null, emptyY = null;

    for (const y of range(0, 9)) {
      if (sudokuSolution.at(x, y) !== 0) {
        possibleValues.delete(sudokuSolution.at(x, y));
      } else {
        if (emptyX !== null) {
          break;
        } else {
          emptyX = x;
          emptyY = y;
        }
      }
    }

    if (possibleValues.size === 1) {
      sudokuSolution.fillCell(emptyX, emptyY, getFirstSetValue(possibleValues))
    }
  }
}

const fillInCells = (sudokuSolution) => {
  for (const y of range(0, 9)) {
    for (const x of range(0, 9)) {
      if (sudokuSolution.at(x, y) === 0) {
        const possibleValues = createPossibleValuesSet();

        for (let tempX of range(0, 9)) {
          if (sudokuSolution.at(tempX, y) !== 0) {
            possibleValues.delete(sudokuSolution.at(tempX, y))
          }
        }

        for (let tempY of range(0, 9)) {
          if (sudokuSolution.at(x, tempY) !== 0) {
            possibleValues.delete(sudokuSolution.at(x, tempY))
          }
        }

        for (let boxX of range(christmasBox(x), christmasBox(x) + 3)) {
          for (let boxY of range(christmasBox(y), christmasBox(y) + 3)) {
            if (sudokuSolution.at(boxX, boxY) !== 0) {
              possibleValues.delete(sudokuSolution.at(boxX, boxY))
            }
          }
        }

        if (possibleValues.size === 1) {
          sudokuSolution.fillCell(x, y, getFirstSetValue(possibleValues))
        }

      }
    }
  }
}