
import { arrayToGrid } from "../utils/transform"

type UpdateListener = (event: UpdateEvent) => void;

interface UpdateEvent {
  x: number;
  y: number;
  value: number;
}

interface Props {
  value: number[];
  onUpdate: UpdateListener;
}

const cellIndexes = new Set<number>([2, 5]);

const cellClasses = (x: number, y: number) => {
  const classes = ['Grid-cell'];

  if (cellIndexes.has(x)) {
    classes.push('Grid-right-border');
  }

  if (cellIndexes.has(x - 1)) {
    classes.push('Grid-left-border');
  }

  if (cellIndexes.has(y)) {
    classes.push('Grid-bottom-border');
  }

  if (cellIndexes.has(y - 1)) {
    classes.push('Grid-top-border');
  }

  return classes.join(' ');
}

export default function SudokuGrid(props: Props) {
  const grid = arrayToGrid(props.value);

  const tryToUpdateCell = (x: number, y: number, value: string) => {
    if (value === '') {
      props.onUpdate({ x, y, value: 0 });
    }

    if (/^[0-9]$/.test(value)) {
      props.onUpdate({ x, y, value: parseInt(value) });
    }
  }

  return (
    <table className="Grid-table">
      <tbody>
        {grid.map((row, y) => (
          <tr key={y}>
            {row.map((value, x) => (
              <td key={x} className="Grid-table-cell">
                <div className={cellClasses(x, y)}>
                  <input
                    type="text"
                    className="Grid-input"
                    value={value === 0 ? '' : `${value}`}
                    onChange={(e) => tryToUpdateCell(x, y, e.target.value)}
                  />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
