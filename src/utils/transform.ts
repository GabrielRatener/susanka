
export const stringToSudoku = (sudokuString: string): number[] => {
  return sudokuString.split('').map((numString) => parseInt(numString));
}

export const arrayToGrid = <T>(array: T[]) => {
  const grid: T[][] = [];

  for (let i = 0; i < 9; i++) {
    grid.push(array.slice(i * 9, (i + 1) * 9));
  }

  return grid;
}

export const range = function*(start: number, end: number, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

export const emptySudoku = () => {
  return stringToSudoku('0'.repeat(9 * 9));
}

export const getFirstSetValue = <T>(set: Set<T>) => {
  for (const value of set) {
    return value;
  }
}
