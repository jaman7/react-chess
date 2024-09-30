import { getPassant, miniMax, setMove } from 'utils';

// worker.js
onmessage = function (event) {
  const { moves, copyBoard, botColor, randStarts, randEnds, depth, params = {} } = event.data || {};
  let bestValue = -10000;
  let bestMove = { start: 100, end: 100 };
  for (const move of moves) {
    const { start, end } = move || {};
    const updatedBoard = setMove([...copyBoard], start, end, params);
    const passantPos = getPassant(botColor, copyBoard, start, end);
    const evaluation = miniMax(depth - 1, false, -10000, 10000, updatedBoard, randStarts, randEnds, botColor, { ...params, passantPos });
    if (evaluation > bestValue) {
      bestValue = evaluation;
      bestMove = { start, end };
    }
  }
  postMessage(bestMove);
};
