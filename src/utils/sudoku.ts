
import { range } from "./transform"

export const EMPTY = 0;

export const pt = (x: number, y: number) => y * 9 + x;

export type CellValue = number;

export class PossibilitiesSet extends Set<number> {
  private solution: SudokuSolution;
  private locked: boolean;

  constructor(solution: SudokuSolution) {
    super([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    this.solution = solution;
    this.locked = true;
  }

  add(value: number) {
    if (this.locked) {
      throw new Error("Cannot add values to possibilities set");
    } else {
      return super.add(value);
    }
  }

  delete(value: number) {
    if (this.has(value)) {
      this.solution.updateSolvedScore();
    }

    return super.delete(value);
  }
}

export const boxPointsAt = function* (x: number, y: number) {
  const baseY = Math.floor(y / 3);
  const baseX = Math.floor(x / 3);

  for (let x = baseX; x < (baseX + 3); x++) {
    for (let y = baseY; y < (baseY + 3); y++) {
      yield new Point(x, y);
    }
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }
}

export class Sudoku {
  initial: number[];

  constructor(initial: number[]) {
    this.initial = initial;
  }

  at(x: number, y: number): number {
    return this.initial[pt(x, y)];
  }

  * values() {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        yield this.at(x, y);
      }
    }
  }

  * botAt(x: number, y: number) {
    for (const point of boxPointsAt(x, y)) {
      yield this.at(point.x, point.y);
    }
  }

  * colAt(x: number) {
    for (const y of range(0, 9)) {
      yield this.at(x, y);
    }
  }

  * rowAt(y: number) {
    for (const x of range(0, 9)) {
      yield this.at(x, y);
    }
  }
}

export class SudokuSolution extends Sudoku {
  private fills: Map<number, number>;
  private initialFillCount: number;
  private initialSolvedScore: number;
  private possibilitySets: Map<number, PossibilitiesSet>;

  solvedScoreSubtraction = 0;

  constructor(sudoku: Sudoku) {
    super(sudoku.initial);

    this.fills = new Map();
    this.initialFillCount =
      sudoku.initial.reduce((count, value) => (value > 0) ? count + 1 : count, 0);
    this.initialSolvedScore = 9 * (9 * 9 - this.initialFillCount);
    this.possibilitySets = new Map<number, PossibilitiesSet>();
  }

  updateSolvedScore(subtraction = 1) {
    this.solvedScoreSubtraction += subtraction;
  }

  at(x: number, y: number): number {
    const index = pt(x, y);

    if (this.fills.has(index)) {
      return this.fills.get(index) as number;
    } else {
      return this.initial[index];
    }
  }

  fillCell(x: number, y: number, value: number) {
    if (value === 0) {
      throw new Error(`Cannot set cell to empty (value = 0).`)
    } else if (!this.cellIsEmpty(x, y)) {
      throw new Error(`Cannot fill (${x},${y}), cell not empty.`)
    } else {
      const { size } = this.cellPossibilitiesSet(x, y);

      this.updateSolvedScore(size);
      this.fills.set(pt(x, y), value);

      if (this.possibilitySets.has(pt(x, y))) {
        this.possibilitySets.delete(pt(x, y));
      }
    }
  }

  cellIsSolved(x: number, y: number) {
    return this.fills.has(pt(x, y));
  }

  cellIsEmpty(x: number, y: number) {
    const index = pt(x, y);

    return this.initial[index] === 0 && !this.fills.has(index);
  }

  cellPossibilitiesSet(x: number, y: number) {
    if (this.possibilitySets.has(pt(x, y))) {
      return this.possibilitySets.get(pt(x, y)) as PossibilitiesSet;
    } else {
      const set = new PossibilitiesSet(this);

      this.possibilitySets.set(pt(x, y), set);

      return set;
    }
  }

  toRawArray() {
    return [...this.values()];
  }

  get fillCount() {
    return this.initialFillCount + this.fills.size;
  }

  get solvedScore() {
    return this.initialSolvedScore - this.solvedScoreSubtraction;
  }

  get isSolved() {
    return this.fillCount === 9 * 9;
  }
}

export const createPossibleValuesSet = () => {
  return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

export class PointMap<T> {
  private internalMap = new Map<number, T>();

  has(x: number, y: number) {
    return this.internalMap.has(pt(x, y));
  }

  get(x: number, y: number) {
    return this.internalMap.get(pt(x, y));
  }

  set(x: number, y: number, value: T) {
    return this.internalMap.set(pt(x, y), value);
  }

  get size() {
    return this.internalMap.size;
  }
}
