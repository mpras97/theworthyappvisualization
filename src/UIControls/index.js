import React from 'react'


export default function UIControls({ layout, selectedPoint, setLayout }) {
  console.log(selectedPoint)
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
      <button
        onClick={() => setLayout('twitter')}
        className={layout === 'twitter' ? 'active' : undefined}
      >
        Twitter
      </button>
      {selectedPoint && (
      	<div className="selected-point">
      	    You selected <strong>{selectedPoint.id}</strong>
      	    <div>Text: <strong>{selectedPoint.text}</strong></div>
      	    <div>Tweeted Person: <strong>{selectedPoint.tweetedPerson}</strong></div>
      	    <div>Location from: <strong>{selectedPoint.distanceFromLoc}</strong></div>
      	    <div>Class: <strong>{selectedPoint.class}</strong></div>
      	</div>)}
    </div>)
}
