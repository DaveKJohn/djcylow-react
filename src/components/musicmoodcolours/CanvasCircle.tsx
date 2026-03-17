import React from 'react';
import '@/styles/components/musicmoodcolours/canvasCircle.scss';

const COLORS = [
  'Orange', 'Yellow', 'Green', 'Cyan',
  'Blue', 'Purple', 'Magenta', 'Red'
];

const LINES = [45, 90, 135, 180];

export default function CanvasCircle() {
  return (
    <div className="column stack extra spacing-9xl black-90-bg in-push-5xl" id="canvas_circle">
      <div className="canvas-circle-container">
        {/* De scheidslijnen */}
        <div className="column overlay lines">
          {LINES.map((deg) => (
            <div key={deg} className={`line line-${deg}`}></div>
          ))}
        </div>

        {/* De gradient overlay */}
        <div className="column overlay gradient"></div>

        {/* De kleurnamen gepositioneerd in de cirkel */}
        <div className="column overlay colours">
          {COLORS.map((color) => (
            <div key={color} className={`colour ${color.toLowerCase()}`}>
              <p>{color}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}