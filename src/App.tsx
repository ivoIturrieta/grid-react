import React from "react";
import "./App.css";

function fibbonacciChecker(num: number) {
  //check if number is in 31 bit space to prevent floating point errors
  //if this is IE isSafeInteger needs to be polyfilled
  if (!Number.isSafeInteger(num)) {
    return "floating point bounds exception";
  }

  //declared here because of hoisting
  var base = 5 * Math.pow(num, 2),
    posBias = Math.sqrt(base + 4) % 1 === 0,
    negBias = Math.sqrt(base - 4) % 1 === 0;

  //filter true conditions
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

const initialMatrix = Array.from(Array(50), (_, rowIndex) => {
  return Array.from(Array(50), (_, colIndex) => ({
    col: colIndex,
    row: rowIndex,
    val: 0
  }));
});

function App() {
  const [matrixState, setMatrixState] = React.useState(initialMatrix);
  const [clickedCell, setClickedCell] = React.useState<any>();
  const [greenCell, setGreenCell] = React.useState<any>();

  React.useEffect(() => {
    if (clickedCell) {
      setTimeout(() => setClickedCell(undefined), 200);
    }
  }, [clickedCell]);

  const numberedVals = () =>
    matrixState.reduce((acc, curr) => {
      const returnedAcc = [...acc];

      curr.forEach((cell, i) => {
        if (i < 4 || cell.val < 3) {
          return null;
        }

        if (fibbonacciChecker(cell.val)) {
          const series = fibonacci_series(cell.val);

          if (curr.slice(i - 4, i).every((c, i) => c.val === series[i])) {
            returnedAcc.push(...curr.slice(i - 4, i), cell);
          }
        }
      });
      return returnedAcc;
    }, []);

  React.useEffect(() => {
    const s = numberedVals();
    if (s.length > 0) {
      s.forEach((a) => {
        setTimeout(() => {
          setMatrixState((prev) =>
            prev.map((s) =>
              s.map((x) =>
                x.col === a.col && x.row === a.row ? { ...x, val: 0 } : x
              )
            )
          );
        }, 500);
      });
    }
  }, [matrixState]);

  const checker = (cell) => {
    const n = numberedVals();
    if (n.includes((a) => a.col === cell.col && a.row === cell.row)) {
      return "green";
    }
  };

  return (
    <div>
      <br />
      {matrixState.map((row, i) => {
        return (
          <div key={i} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((cell) => {
              return (
                <div
                  onClick={() => {
                    setClickedCell(cell);
                    setMatrixState((prev) => {
                      return prev.map((row, i: number) => {
                        if (cell.row === i) {
                          return row.map((cell) => {
                            return {
                              ...cell,
                              val: cell.val + 1
                            };
                          });
                        } else {
                          return row.map((c) => {
                            return c.col === cell.col
                              ? {
                                  ...c,
                                  val: c.val + 1
                                }
                              : c;
                          });
                        }
                      });
                    });
                  }}
                  key={`${cell.col}${cell.row}`}
                  style={{
                    background:
                      clickedCell &&
                      (cell.row === clickedCell.row ||
                        cell.col === clickedCell.col)
                        ? "yellow"
                        : "white",
                    border: "1px solid black",
                    width: 22,
                    height: 22,
                    cursor: "pointer"
                  }}
                >
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
