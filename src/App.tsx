import React from 'react';

interface ICell {
    val: number;
    col: number;
    row: number;
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

const gridSize = 50;

const initialMatrix = () => {
    const newArr = new Array(gridSize).fill(0);
    return newArr.reduce((acc, _, rowIndex) => {
        return {
            ...acc,
            [rowIndex]: newArr.reduce(
                (acc, _, colIndex) => ({
                    ...acc,
                    [colIndex]: { col: colIndex, row: rowIndex, val: 0 },
                }),
                {}
            ),
        };
    }, {});
};

function App() {
    const [matrixState, setMatrixState] = React.useState<{
        [k: number]: { [k: number]: { val: number; col: number; row: number } };
    }>(initialMatrix());
    const [clickedCell, setClickedCell] = React.useState<any>();

    React.useEffect(() => {
        if (clickedCell) {
            setTimeout(() => setClickedCell(undefined), 200);
        }
    }, [clickedCell]);

    const numberedVals = React.useCallback(
        () =>
            Object.values(matrixState).reduce((acc, curr) => {
                //@ts-ignore
                const returnedAccRows: any = [...acc];
                Object.values(curr).forEach((cell, rowIndex) => {
                    if (rowIndex < 4 || cell.val < 2 || !fibbonacciChecker(cell.val)) {
                        return null;
                    }

                    const series: number[] = fibonacci_series(cell.val + 1);

                    const shortenSeries = series.slice(
                        series.indexOf(cell.val) - 4,
                        series.indexOf(cell.val)
                    );

                    if (
                        Object.values(curr)
                            .slice(rowIndex - 4, rowIndex)
                            .every((c: any, i: number) => c.val === shortenSeries[i])
                    ) {
                        returnedAccRows.push(
                            ...Object.values(curr).slice(rowIndex - 4, rowIndex),
                            cell
                        );
                    }
                });
                return returnedAccRows;
            }, []),
        [matrixState]
    );

    React.useEffect(() => {
        const fibValues = numberedVals();
        if (Object.keys(fibValues).length > 0) {
            Object.values(fibValues).forEach((cell: ICell) => {
                setMatrixState((prev) => ({
                    ...prev,
                    [cell.row]: {
                        ...prev[cell.row],
                        [cell.col]: {
                            ...prev[cell.row][cell.col],
                            val: 0,
                        },
                    },
                }));
            });
        }
    }, [matrixState, numberedVals]);

    const cellColor = (cell: ICell) => {
        if (
            Object.values(numberedVals()).filter((c) => c.col === cell.col && c.row === cell.row)
                .length > 0
        ) {
            return 'green';
        } else if (clickedCell && (cell.row === clickedCell.row || cell.col === clickedCell.col)) {
            return 'yellow';
        } else {
            return 'white';
        }
    };

    return (
        <div>
            {Object.values(matrixState).map((row, i) => {
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                        {Object.values(row).map((cell) => {
                            return (
                                <div
                                    onClick={() => {
                                        setClickedCell(cell);

                                        setMatrixState((prev) => {
                                            return {
                                                //@ts-ignore
                                                ...Object.values(prev).reduce((acc, curr, i) => {
                                                    if (cell.row === i) {
                                                        return acc;
                                                    } else {
                                                        return {
                                                            ...acc,
                                                            [i]: {
                                                                ...prev[i],
                                                                [cell.col]: {
                                                                    ...prev[i][cell.col],
                                                                    val: prev[i][cell.col].val + 1,
                                                                },
                                                            },
                                                        };
                                                    }
                                                }, {}),

                                                [cell.row]: Object.values(prev[cell.row]).reduce(
                                                    (acc, curr, i: number) => {
                                                        return {
                                                            ...acc,
                                                            [i]: { ...curr, val: curr.val + 1 },
                                                        };
                                                    },
                                                    {}
                                                ),
                                            };
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
