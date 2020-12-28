import PropTypes from 'prop-types';
import Cell, { cellHeight, cellRadius } from './Cell';

const Layer = ({cells, onCellClick, position = [0, 0, 0]}) => {

  const layerLength = cells.length;
  const layerSize = Math.sqrt(layerLength);

  return (
    <group
      {...{position}}
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
            state={cell.state}
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
  onCellClick: PropTypes.func.isRequired,
  position: PropTypes.array,
};

const Component = ({size, cells, onCellClick, position = [0, 0, 0]}) => {
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
      {...{position}}
    >
      {layers.map((layer) => (
        <Layer
          key={layer.stepsFromBoard}
          cells={layer.cells}
          stepsFromBoard={layer.stepsFromBoard}
          onCellClick={onCellClick}
          position={[0, cellHeight * (layer.stepsFromBoard - 1), 0]}
        />
      ))}
    </group>
  )
};

Component.propTypes = {
  size: PropTypes.number.isRequired,
  cells: PropTypes.array.isRequired,
  onCellClick: PropTypes.func.isRequired,
  position: PropTypes.array,
};

export default Component;
