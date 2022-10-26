/**
 * Code take from https://github.com/okalachev/arucogen
 * MIT License

  Copyright (c) 2018 Oleg Kalachev

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 * 
 * 
 * Markers dictionaries are taken from this URL: https://raw.githubusercontent.com/opencv/opencv_contrib/master/modules/aruco/src/predefined_dictionaries.hpp.
 * Learn more about ArUco markers: https://docs.opencv.org/3.2.0/d5/dae/tutorial_aruco_detection.html. 
 */

import dict from './dict';
import { svg, h, } from '@cycle/dom';
import * as R from 'ramda';

function generateMarkerSvg(width: number, height: number, bits) {
	// var svg = document.createElement('svg');
	// svg.setAttribute('viewBox', '0 0 ' + (width + 2) + ' ' + (height + 2));
	// svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	// svg.setAttribute('shape-rendering', 'crispEdges');

  const pixels = [];
  pixels.push(h('rect', { attrs: { x: 0, y: 0, width: 6, height: 6, fill: 'black' } }));

  	// "Pixels"
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var white = bits[i * height + j];
			if (!white) continue;

      pixels.push(h('rect', { attrs: { x: j+1, y: i+1, width: 1, height: 1, fill: 'white' } }));
      continue;
			if (!fixPdfArtifacts) continue;

			if ((j < width - 1) && (bits[i * height + j + 1])) {
				pixel.setAttribute('width', 1.5);
			}

			if ((i < height - 1) && (bits[(i + 1) * height + j])) {
				var pixel2 = document.createElement('rect');;
				pixel2.setAttribute('width', 1);
				pixel2.setAttribute('height', 1.5);
				pixel2.setAttribute('x', j + 1);
				pixel2.setAttribute('y', i + 1);
				pixel2.setAttribute('fill', 'white');
				svg.appendChild(pixel2);
			}
		}
	}

  return svg('.marker-node-img.unselectable',
    { attrs: { 'shape-rendering': 'crispEdges', viewBox: '0 0 6 6', xmlns: 'http://www.w3.org/2000/svg' } },
    pixels
  );
}

function generateArucoMarkerGraphic(id) {
	var bytes = dict[id];
	var bits = [];
	var bitsCount = 4 * 4;

	// Parse marker's bytes
	for (var byte of bytes) {
		var start = bitsCount - bits.length;
		for (var i = Math.min(7, start - 1); i >= 0; i--) {
			bits.push((byte >> i) & 1);
		}
	}

	return generateMarkerSvg(4, 4, bits);
}

// Memoized so that it doesn't run this every time the marker data updates
export default generateArucoMarkerGraphic; //R.memoizeWith(Number, generateArucoMarkerGraphic);
