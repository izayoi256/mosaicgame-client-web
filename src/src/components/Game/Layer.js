import Cell, { cellWidth, cellHeight, cellDepth } from './Cell';

export default (props) => {
  const layerY = cellHeight * (props.steps - 1);
  const layerLength = props.cells.length;
  const layerSize = Math.sqrt(layerLength);
  const Cells = props.cells.map((cell, cellIndexInLayer) => {
    const cellCoordX = cellIndexInLayer % layerSize;
    const cellCoordZ = Math.floor(cellIndexInLayer / layerSize);
    const cellX = (cellCoordX - ((layerSize - 1) / 2)) * cellWidth;
    const cellZ = (cellCoordZ - ((layerSize - 1) / 2)) * cellDepth;
    return (
      <Cell
        index={cell.index}
        value={cell.value}
        onClick={props.onCellClick}
        position={[cellX, 0, cellZ]}
      />
    )
  });
  return (
    <group
      position={[0, layerY, 0]}
    >
      {Cells}
    </group>
  )
};
