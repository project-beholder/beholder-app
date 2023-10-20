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
 *
 * Modifications to fit this project wer done by Peter Gyory
 */

import dict from './dict';

function generateArucoMarkerGraphic(id: number) {
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

    const pixels = [];
    pixels.push(<rect key={`0`} x={0} y={0} width={6} height={6} fill="black"></rect>);

  	// "Pixels"
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var white = bits[i * 4 + j];
			if (!white) continue;
            pixels.push(<rect key={`${i}-${j}`} x={j+1} y={i+1} width={1} height={1} fill="white"></rect>);
		}
	}

    return (<svg
            className="marker-node-img unselectable"
            shapeRendering="crispEdges"
            viewBox="0 0 6 6"
            xmlns="http://www.w3.org/2000/svg"
        >
            {pixels}
        </svg>);

}

export default generateArucoMarkerGraphic;
