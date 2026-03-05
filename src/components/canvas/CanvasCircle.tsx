import React from 'react';

const COLORS = [
  'Orange', 'Yellow', 'Green', 'Cyan', 
  'Blue', 'Purple', 'Magenta', 'Red'
];

const LINES = [45, 90, 135, 180];

export default function CanvasCircle() {
  return (
    <div className="canvas-circle-container">
      {/* De scheidslijnen */}
      <div className="column overlay wrapper lines">
        {LINES.map((deg) => (
          <div key={deg} className={`line line-${deg}`}></div>
        ))}
      </div>

      {/* De gradient overlay */}
      <div className="column overlay wrapper gradient"></div>

      {/* De kleurnamen gepositioneerd in de cirkel */}
      <div className="column overlay wrapper colours">
        {COLORS.map((color) => (
          <div key={color} className={`colour ${color.toLowerCase()}`}>
            <p>{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}