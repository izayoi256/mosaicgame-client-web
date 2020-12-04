import PropTypes from 'prop-types';
import Cell, { cellHeight, cellRadius } from './Cell';

const cellsY = cellHeight * 0.5;

const Layer = ({cells, stepsFromBoard, onCellClick}) => {

  const layerY = cellHeight * (stepsFromBoard - 1);
  const layerLength = cells.length;
  const layerSize = Math.sqrt(layerLength);

  return (
    <group
      position={[0, layerY, 0]}
    >
      {cells.map((cell, cellIndexInLayer) => {
        const cellCoordX = cellIndexInLayer % layerSize;
        const cellCoordZ = Math.floor(cellIndexInLayer / layerSize);
        const cellX = (cellCoordX - ((layerSize - 1) / 2)) * cellRadius * 2;
        const cellZ = (cellCoordZ - ((layerSize - 1) / 2)) * cellRadius * 2;
        return (
          <Cell
            key={cell.index}
            index={cell.index}
            value={cell.value}
            onClick={onCellClick}
            position={[cellX, 0, cellZ]}
          />
        )
      })}
    </group>
  )
};

Layer.propTypes = {
  cells: PropTypes.array.isRequired,
  stepsFromBoard: PropTypes.number.isRequired,
  onCellClick: PropTypes.func.isRequired,
};

const Component = ({size, cells, onCellClick}) => {
  const layers = [];

  Array(size).fill().map((_, k) => k + 1).reduce((layerStart, layerSize) => {
    const layerEnd = layerStart + Math.pow(layerSize, 2);
    const layerCells = cells.slice(layerStart, layerEnd);
    const layer = {
      stepsFromBoard: size - layerSize + 1,
      cells: layerCells,
    };
    layers.push(layer);
    return layerEnd;
  }, 0);

  return (
    <group
      position={[0, cellsY, 0]}
    >
      {layers.map((layer) => (
        <Layer
          key={layer.stepsFromBoard}
          cells={layer.cells}
          stepsFromBoard={layer.stepsFromBoard}
          onCellClick={onCellClick}
        />
      ))}
    </group>
  )
};

Component.propTypes = {
  size: PropTypes.number.isRequired,
  cells: PropTypes.array.isRequired,
  onCellClick: PropTypes.func.isRequired,
};

export default Component;
