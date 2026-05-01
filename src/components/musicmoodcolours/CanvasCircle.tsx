import React from 'react';

// @ts-ignore
import '@/styles/components/musicmoodcolours/canvasCircle.scss';

const COLORS = [
	'Orange', 'Yellow', 'Green', 'Cyan',
	'Blue', 'Purple', 'Magenta', 'Red'
];

const LINES = [45, 90, 135, 180];

export default function CanvasCircle() {
	return (
		<div className="stack w-fix AMC fill-90" id="canvas_circle">
			
				{/* De scheidslijnen */}
				<div className="layer lines">
					{LINES.map((deg) => (
						<div key={deg} className={`line line-${deg}`}></div>
					))}
				</div>

				{/* De gradient overlay */}
				<div className="layer w-fix circle"></div>

				{/* De kleurnamen gepositioneerd in de cirkel */}
				<div className="layer overlay colours">
					{COLORS.map((color) => (
						<div key={color} className={`colour ${color.toLowerCase()}`}>
							<p>{color}</p>
						</div>
					))}
				</div>
			
		</div>
	);
}