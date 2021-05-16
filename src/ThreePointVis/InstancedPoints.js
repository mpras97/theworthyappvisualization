import * as React from 'react';
import * as THREE from 'three';
import { useAnimatedLayout } from './layouts';

// re-use for instance computations
const scratchObject3D = new THREE.Object3D();

function updateInstancedMeshMatrices({ mesh, data }) {
  if (!mesh) return;

  // set the transform matrix for each instance
  for (let i = 0; i < data.length; ++i) {
    const { x, y, z } = data[i];

    scratchObject3D.position.set(x, y, z);
    scratchObject3D.rotation.set(0.5 * Math.PI, 0, 0); // cylinders face z direction
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

const SELECTED_COLOR = '#6f6';
const DEFAULT_COLOR = '#fff';
const COLORS_1 = '#293241'
const COLORS_2 = '#ee6c4d'
const COLORS_3 = '#e0fbfc'
const COLORS_4 = '#98c1d9'
const COLORS_5 = '#3d5a80'

// re-use for instance computations
const scratchColor = new THREE.Color();

const usePointColors = ({ data, selectedPoint }) => {
  const numPoints = data.length;
  const colorAttrib = React.useRef();
  const colorArray = React.useMemo(() => new Float32Array(numPoints * 3), [
    numPoints,
  ]);

  React.useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      scratchColor.set(
        data[i] === selectedPoint ? SELECTED_COLOR : data[i].class === 0 ? COLORS_5 : data[i].class === 1 ? COLORS_4 : data[i].class === 2 ? COLORS_3 : data[i].class === 3 ? COLORS_2 : data[i].class === 4 ? COLORS_1 : DEFAULT_COLOR
      );
      scratchColor.toArray(colorArray, i * 3);
    }
    colorAttrib.current.needsUpdate = true;
  }, [data, selectedPoint, colorArray]);

  return { colorAttrib, colorArray };
};

const useMousePointInteraction = ({ data, selectedPoint, setSelectedPoint }) => {
  // track mousedown position to skip click handlers on drags
  const mouseDownRef = React.useRef([0, 0]);
  const handlePointerDown = e => {
    mouseDownRef.current[0] = e.clientX;
    mouseDownRef.current[1] = e.clientY;
  };

  const handleClick = event => {
    const { instanceId, clientX, clientY } = event;
    const downDistance = Math.sqrt(
      Math.pow(mouseDownRef.current[0] - clientX, 2) +
        Math.pow(mouseDownRef.current[1] - clientY, 2)
    );

    // skip click if we dragged more than 5px distance
    if (downDistance > 5) {
      event.stopPropagation();
      return;
    }

    // index is instanceId if we never change sort order
    const index = instanceId;
    const point = data[index];

    // toggle the point
    if (point === selectedPoint) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint(point);
    }
  };

  return { handlePointerDown, handleClick };
};

const InstancedPoints = ({ data, layout, selectedPoint, setSelectedPoint }) => {
  const meshRef = React.useRef();
  const numPoints = data.length;

  // run the layout, animating on change
  useAnimatedLayout({
    data,
    layout,
    onFrame: () => {
      updateInstancedMeshMatrices({ mesh: meshRef.current, data });
    },
  });

  // update instance matrices only when needed
  React.useEffect(() => {
    updateInstancedMeshMatrices({ mesh: meshRef.current, data });
  }, [data, layout]);

  const { handleClick, handlePointerDown } = useMousePointInteraction({
    data,
    selectedPoint,
    setSelectedPoint,
  });
  const { colorAttrib, colorArray } = usePointColors({ data, selectedPoint });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, numPoints]}
      frustumCulled={false}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, 0.15, 32]}>
        <instancedBufferAttribute
          ref={colorAttrib}
          attachObject={['attributes', 'color']}
          args={[colorArray, 3]}
        />
      </cylinderBufferGeometry>
      <meshStandardMaterial
        attach="material"
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  );
};

export default InstancedPoints;
