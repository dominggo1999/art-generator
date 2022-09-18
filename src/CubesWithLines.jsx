import React, { useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import 'twin.macro';
import p5Types from 'p5';
import { checkIntersection } from 'line-intersect';

const CW = 500;
const CH = 500;
const COL = 4;
const ROW = 4;
const STEP_W = CW / COL;
const STEP_H = CH / ROW;
const NUM_OF_STRIPES = [1, 3, 5, 7];

/**
 * @param {p5Types} p5
 */
const sketch = (p5) => {
  /**
 * @type {p5Types}
 */
  let p;

  p5.setup = () => {
    const vw = window.innerWidth;

    p = p5.createGraphics(CW * 4, CH * 4);
    p5.createCanvas(CW, CH);

    if (vw < CW) {
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
    p.stroke('#ffffff');
    p.background('#000000');

    const SW = STEP_W * 4;
    const SH = STEP_H * 4;
    // const PERSPECTIVE = p5.random(0.1, 0.5);
    const PERSPECTIVE = 0.3;

    p.strokeWeight(10);

    let x = 0;

    while (x <= CW * 4) {
      let y = 0;
      let row = 0;
      const savedX = x;

      while (y < CH * 4 + SH) {
        if (row % 2 !== 0) {
          x -= SW * 0.5;
        } else {
          x = savedX;
        }

        // Roof
        p.beginShape();
        p.fill('#581545');
        p.vertex(x, y);
        p.vertex(x + 0.5 * SW, y + -PERSPECTIVE * SH);
        p.vertex(x + SW, y);
        p.vertex(x + 0.5 * SW, y + PERSPECTIVE * SH);
        p.endShape(p5.CLOSE);
        const verticalDiagonal = PERSPECTIVE * SH;

        const nStripes = NUM_OF_STRIPES[Math.floor(p.random(NUM_OF_STRIPES.length))];

        for (let i = 1; i < nStripes; i += 1) {
          const left = i / nStripes;
          const right = 1 - left;

          const newX = left * (x + 0.5 * SW) + right * (x);

          const newY = left * (y + PERSPECTIVE * SH) + right * (y);

          const rX = newX + SW;
          const rY = (newY - SH * PERSPECTIVE * 2);

          const { point } = checkIntersection(x + 0.5 * SW, y + -PERSPECTIVE * SH, x + SW, y, newX, newY, rX, rY);

          p.line(newX, newY, point.x, point.y);
        }

        // Left Side
        p.beginShape();
        p.fill('#612951');
        p.vertex(x, y);
        p.vertex(x, y + SH * 0.5);
        p.vertex(x + SH * 0.5, y + SH * (0.5 + PERSPECTIVE));
        p.vertex(x + 0.5 * SW, y + PERSPECTIVE * SH);
        p.endShape(p5.CLOSE);

        // Right Side
        p.beginShape();
        p.fill('#f7d6f1');
        p.vertex(x + 0.5 * SW, y + PERSPECTIVE * SH);
        p.vertex(x + SH * 0.5, y + SH * (0.5 + PERSPECTIVE));
        p.vertex(x + SW, y + SH * 0.5);
        p.vertex(x + SW, y);
        p.endShape(p5.CLOSE);

        y += SH * (0.5 + PERSPECTIVE);
        row += 1;
      }

      x = savedX + SW;
    }

    p5.image(p, 0, 0, CW, CH);
  };

  p5.windowResized = () => {
    const vw = window.innerWidth;

    if (vw < CW) {
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
