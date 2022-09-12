import React, { useEffect, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import 'twin.macro';
import p5Types from 'p5';

//  /**
//  * @param {p5Types} p5
//  * @param {Element} canvasRef
//  */

const CW = 500;
const CH = 500;
const COL = 20;
const ROW = 20;
const STEP_W = CW / COL;
const STEP_H = CH / ROW;

/**
 * @param {p5Types} p5
 */
const sketch = (p5) => {
  /**
 * @type {p5Types}
 */
  let p;

  const randomDiagonaLine = (x, y, STEP_W, STEP_H) => {
    const random = Math.random();
    p.strokeWeight(12 * 12);
    p.strokeCap(p.PROJECT);

    if (random > 0.5) {
      p.line(x, y, x + STEP_W * 0.5, y + STEP_H * 0.5);
    } else {
      p.line(x + STEP_W, y, x, y + STEP_H);
    }
  };

  p5.setup = () => {
    const vw = window.innerWidth;

    p = p5.createGraphics(CW * 12, CH * 12);
    p5.createCanvas(CW, CH);

    if (vw < 500) {
      p5.canvas.style.width = `${vw}px`;
      p5.canvas.style.height = `${vw * (CW / CH)}px`;
    }
    p5.noLoop();
  };

  p5.updateWithProps = (props) => {
    p5.redraw();
  };

  p5.draw = () => {
    p.ellipseMode(p.CORNER);
    p5.background(0);
    p.stroke('#db8421');
    p.background('#000000');
    for (let x = 0; x < CW * 12; x += STEP_W * 12) {
      for (let y = 0; y < CH * 12; y += STEP_H * 12) {
        randomDiagonaLine(x, y, STEP_W * 12, STEP_H * 12);
      }
    }

    p5.image(p, 0, 0, CW, CH);
  };

  p5.windowResized = () => {
    const vw = window.innerWidth;

    if (vw < 500) {
      p5.canvas.style.width = `${vw}px`;
      p5.canvas.style.height = `${vw * (CW / CH)}px`;
    } else {
      p5.canvas.style.width = `${CW}px`;
      p5.canvas.style.height = `${CH}px`;
    }
  };
};

const App = () => {
  const [force, setForce] = useState(false);

  const download = () => {
    const node = document.querySelectorAll('canvas')[0];
    const FILE_NAME = 'art.png';

    const link = document.createElement('a');
    link.download = `${FILE_NAME}.png`;
    link.href = node.toDataURL();
    link.click();
  };

  return (
    <div tw="bg-[#1E1E1E] min-h-screen justify-center w-full flex py-20">
      <ReactP5Wrapper
        sketch={sketch}
        force={force}
      />

      <div tw="fixed text-black bottom-3 right-3 flex flex-col">
        <button
          tw=" rounded-full bg-blue-500 hover:bg-blue-300 px-6 py-2 text-lg font-medium mb-2"
          onClick={() => setForce(!force)}
        >
          Refresh
        </button>
        <button
          tw=" rounded-full bg-blue-500 hover:bg-blue-300 px-6 py-2 text-lg font-medium"
          onClick={download}
        >
          Download
        </button>
      </div>

    </div>
  );
};

export default App;
