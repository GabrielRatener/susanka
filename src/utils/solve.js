
import { createPossibleValuesSet, SudokuSolution } from "./sudoku"
import { range, getFirstSetValue } from "./transform"

export const solve = (sudoku) => {
  const solution = new SudokuSolution(sudoku);

  while (true) {
    const fillCount = solution.fillCount;

    fillInRows(solution)
    fillInColumns(solution)

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
