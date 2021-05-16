import React from 'react'


export default function UIControls({ layout, selectedPoint, setLayout }) {
  return (
  	<div className="controls">
      <strong>Layouts</strong>{' '}
      <button
        onClick={() => setLayout('grid')}
        className={layout === 'grid' ? 'active' : undefined}
      >
        Grid
      </button>
      <button
        onClick={() => setLayout('spiral')}
        className={layout === 'spiral' ? 'active' : undefined}
      >
        Spiral
      </button>
      {selectedPoint && (
      	<div className="selected-point">
      	    You selected <strong>{selectedPoint.id}</strong>
      	</div>)}
    </div>)
}
