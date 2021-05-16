import * as React from 'react';
import ThreePointVis from './ThreePointVis/ThreePointVis';
import './styles.css';
import UIControls from './UIControls';

// The data will be replaced by our requirement
// This is a 1D data to be changed to 2D depending upon categories
// Or else distance from current point with categorization based upon tweets
const data = new Array(10000).fill(0).map((d, id) => ({ id }));

export default function App() {
  const [layout, setLayout] = React.useState('grid');
  const [selectedPoint, setSelectedPoint] = React.useState(null)

  return (
    <div className="App">
      <div className="vis-container">
        <ThreePointVis
          data={data}
          layout={layout}
          selectedPoint={selectedPoint}
          setSelectedPoint={setSelectedPoint}
        />
      </div>
      <UIControls
        layout={layout}
        selectedPoint={selectedPoint}
        setLayout={setLayout}
      />
    </div>
  );
}
