import React from 'react';
import './App.css';

interface ICell {
    val: number;
    col: number;
    row: number;
}

function currentCellFibChecker(cell: ICell, i: number, currArr: any, returnedAcc: any) {
    if (i < 4 || cell.val < 3) {
        return null;
    }

    if (fibbonacciChecker(cell.val)) {
        const series: number[] = fibonacci_series(cell.val);
        const shortenSeries = series.slice(
            series.indexOf(cell.val) - 4,
            series.indexOf(cell.val) + 1
        );

        if (currArr.slice(i - 4, i).every((c: ICell, i: number) => c.val === shortenSeries[i])) {
            returnedAcc.push(...currArr.slice(i - 4, i), cell);
        }
    }
}

function fibbonacciChecker(num: number) {
    if (!Number.isSafeInteger(num)) {
        return 'floating point bounds exception';
    }

    var base = 5 * Math.pow(num, 2),
        posBias = Math.sqrt(base + 4) % 1 === 0,
        negBias = Math.sqrt(base - 4) % 1 === 0;

    if (posBias || negBias) {
        return true;
    }
    return false;
}

function fibonacci_series(n: number) {
    if (n === 1) {
        return [0, 1];
    } else {
        const s: any = fibonacci_series(n - 1);
        s.push(s[s.length - 1] + s[s.length - 2]);
        return s;
    }
}

const gridSize = 10;

const totalInSpot = Array.from(Array(gridSize), (_, index) => {
    return index;
});

const initialMatrix = Array.from(Array(10), (_, rowIndex) => {
    return Array.from(Array(10), (_, colIndex) => ({
        col: colIndex,
        row: rowIndex,
        val: 0,
    }));
}).flat();

function App() {
    console.log(initialMatrix);
    const [matrixState, setMatrixState] = React.useState<ICell[]>(initialMatrix);
    const [clickedCell, setClickedCell] = React.useState<any>();

    React.useEffect(() => {
        if (clickedCell) {
            setTimeout(() => setClickedCell(undefined), 200);
        }
    }, [clickedCell]);

    const numberedVals = React.useCallback(
        () =>
            totalInSpot.reduce((acc, lineIndex) => {
                const returnedAccRows: any = [...acc];

                const currentRow = matrixState.filter((s) => s.row === lineIndex);
                const currentCol = matrixState.filter((s) => s.col === lineIndex);

                currentRow.forEach((cell, rowIndex) => {
                    if (rowIndex < 4 || cell.val < 2) {
                        return null;
                    }

                    if (fibbonacciChecker(cell.val)) {
                        const series: number[] = fibonacci_series(cell.val + 1);
                        const shortenSeries = series.slice(
                            series.indexOf(cell.val) - 4,
                            series.indexOf(cell.val)
                        );

                        if (
                            currentRow
                                .slice(rowIndex - 4, rowIndex)
                                .every((c: any, i: number) => c.val === shortenSeries[i])
                        ) {
                            returnedAccRows.push(...currentRow.slice(rowIndex - 4, rowIndex), cell);
                        }
                    }
                });

                currentCol.forEach((cell, colIndex) => {
                    if (colIndex < 4 || cell.val < 2) {
                        return null;
                    }

                    if (fibbonacciChecker(cell.val)) {
                        const series: number[] = fibonacci_series(cell.val + 1);
                        const shortenSeries = series.slice(
                            series.indexOf(cell.val) - 4,
                            series.indexOf(cell.val)
                        );

                        if (
                            currentCol
                                .slice(colIndex - 4, colIndex)
                                .every((c: any, i: number) => c.val === shortenSeries[i])
                        ) {
                            returnedAccRows.push(...currentCol.slice(colIndex - 4, colIndex), cell);
                        }
                    }
                });

                return returnedAccRows;
            }, []),
        [matrixState]
    );

    React.useEffect(() => {
        const fibValues = numberedVals();
        if (fibValues.length > 0) {
            setTimeout(() => {
                fibValues.forEach((cell: ICell) => {
                    setMatrixState((prev) =>
                        prev.map((c) =>
                            c.row === cell.row && c.col === cell.col ? { ...c, val: 0 } : c
                        )
                    );
                });
            }, 200);
        }
    }, [matrixState, numberedVals]);

    console.log(numberedVals());

    const cellColor = (cell: ICell) => {
        const fibValues: ICell[] = numberedVals();
        if (fibValues.filter((c) => c.col === cell.col && c.row === cell.row).length > 0) {
            return 'green';
        } else if (clickedCell && (cell.row === clickedCell.row || cell.col === clickedCell.col)) {
            return 'yellow';
        } else {
            return 'white';
        }
    };

    return (
        <div>
            {totalInSpot.map((rowIndex, i) => {
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                        {matrixState
                            .filter((s) => s.row === rowIndex)
                            .map((cell) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setClickedCell(cell);
                                            setMatrixState((prev) => {
                                                return prev.map((c) => {
                                                    if (c.row === rowIndex || c.col === cell.col) {
                                                        return {
                                                            ...c,
                                                            val: c.val + 1,
                                                        };
                                                    } else {
                                                        return c;
                                                    }
                                                });
                                            });
                                        }}
                                        key={`${cell.col}${cell.row}`}
                                        style={{
                                            background: cellColor(cell),
                                            border: '1px solid black',
                                            width: 20,
                                            height: 20,
                                            cursor: 'pointer',
                                        }}>
                                        {cell.val}
                                    </div>
                                );
                            })}
                    </div>
                );
            })}
        </div>
    );
}

export default App;
