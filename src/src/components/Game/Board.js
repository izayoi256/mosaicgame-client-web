import { cellWidth, cellHeight, cellDepth } from './Cell';
import Layer from './Layer';

export const boardHeight = 10;

const BoardMesh = (props) => {
  const boardWidth = cellWidth * (props.size + 1);
  const boardDepth = cellDepth * (props.size + 1);
  const boardY = boardHeight * -0.5;
  const color = 0xDEB887;
  return (
    <mesh
      position={[0, boardY, 0]}
      receiveShadow
    >
      <boxBufferGeometry args={[boardWidth, boardHeight, boardDepth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default (props) => {

  const layersY = cellHeight * 0.5;
  const cells = props.board.map((v, k) => ({index: k, value: v}));
  const layers = [];
  Array(props.size).fill(null).map((_, k) => k + 1).reduce((layerStart, layerSize) => {
    const layerEnd = layerStart + Math.pow(layerSize, 2);
    const layerCells = cells.slice(layerStart, layerEnd);
    const layer = {
      steps: props.size - layerSize + 1,
      cells: layerCells,
    };
    layers.push(layer);
    return layerEnd;
  }, 0);

  return (
    <group onClick={(e) => e.stopPropagation()}>
      <group
        position={[0, layersY, 0]}
      >
        {layers.reverse().map(layer => (
          <Layer steps={layer.steps} cells={layer.cells} onCellClick={props.onCellClick} />
        ))}
      </group>
      <BoardMesh
        size={props.size}
      />
    </group>
  );
};