import React, { useEffect, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import 'twin.macro';
import p5Types from 'p5';
import randomColor from 'randomcolor';

//  /**
//  * @param {p5Types} p5
//  * @param {Element} canvasRef
//  */

const CW = 500;
const CH = 700;
const COL = 10;
const ROW = 10;
const STEP_W = CW / COL;
const STEP_H = CW / ROW;
const ROTATION = [0, 60, 120, 180, 240, 300];

const frequency = {
  '#372668': 10,
  '#DC7190': 1,
  '#58B0AA': 1,
  '#7e70a5': 2,
  '#261f3b': 10,
  '#F5A081': 3,
};

// const frequency = {
//   '#266844': 10,
//   '#71dca7': 1,
//   '#155746': 1,
//   '#9aeb85': 2,
//   '#3b1f1f': 10,
//   '#81f5ef': 3,
// };

const createFrequencyBasedArray = (frequency) => {
  const collect = [];

  Object.keys(frequency).forEach((key) => {
    const n = frequency[key];
    for (let i = 0; i < n; i += 1) {
      collect.push(key);
    }
  });

  return collect;
};

const COLORS = createFrequencyBasedArray(frequency);

const randomRotation = () => {
  const randomIndex = Math.ceil(Math.random() * ROTATION.length - 1);

  return ROTATION[randomIndex];
};

const generateColors = (n = 10) => {
  const collect = [];
  let prevColor = '';

  while (collect.length < n) {
    const randomIndex = Math.ceil(Math.random() * (COLORS.length - 1));
    const color = COLORS[randomIndex];

    if (color !== prevColor) {
      collect.push(color);
      prevColor = color;
    }
  }

  return collect;
};

/**
 * @param {p5Types} p5
 */
const sketch = (p5) => {
  /**
 * @type {p5Types}
 */
  let p;

  const drawHexagon = (r, x, y) => {
    p.angleMode(p.DEGREES);
    const sideLength = r * 2;
    const strokeWidth = 10;
    const numOfLine = sideLength / strokeWidth;
    const colors = generateColors(numOfLine);

    let start = strokeWidth;

    p.strokeWeight(strokeWidth);

    for (let i = 0; i < numOfLine; i += 1) {
      p.stroke(colors[i]);
      p.beginShape();

      p.vertex(x + Math.cos((0 * p.TAU) / 6) * (2 * r - start), y + Math.sin((0 * p.TAU) / 6) * (2 * r - start));
      p.vertex(x + Math.cos((1 * p.TAU) / 6) * (2 * r - start), y + Math.sin((1 * p.TAU) / 6) * (2 * r - start));
      p.vertex(x + Math.cos((1 * p.TAU) / 6) * (2 * r - start) - sideLength, y + Math.sin((1 * p.TAU) / 6) * (2 * r - start));
      p.endShape();

      p.beginShape();
      p.vertex(x + Math.cos((0 * p.TAU) / 6) * (2 * r - start), y + Math.sin((0 * p.TAU) / 6) * (2 * r - start));
      p.vertex(x + Math.cos((5 * p.TAU) / 6) * (2 * r - start), y + Math.sin((5 * p.TAU) / 6) * (2 * r - start));
      p.vertex(x + Math.cos((5 * p.TAU) / 6) * (2 * r - start) - sideLength, y + Math.sin((5 * p.TAU) / 6) * (2 * r - start));
      p.endShape();
      start += strokeWidth;
    }

    p.beginShape();
    p.stroke('#372668');
    p.fill('rgba(0,0,0,0)');
    p.strokeWeight(strokeWidth);

    for (let i = 0; i <= 6; i += 1) {
      p.vertex(x + Math.cos((i * p.TAU) / 6) * 2 * r, y + Math.sin((i * p.TAU) / 6) * 2 * r);
    }

    p.endShape();
  };

  p5.setup = () => {
    const vw = window.innerWidth;

    p = p5.createGraphics(CW * 4, CH * 4);
    p5.createCanvas(CW, CH);

    if (vw < CW) {
      p5.canvas.style.width = `${vw}px`;
      p5.canvas.style.height = `${vw * (CW / CH)}px`;
    }
    p.angleMode(p.DEGREES);
    p.rectMode(p.CENTER);
    p5.noLoop();
  };

  // TODO
  //  USE TIME TO DETERMINE REDRAW OR NOT
  p5.updateWithProps = (props) => {
    p5.redraw();
  };

  p5.draw = () => {
    p.ellipseMode(p.CORNER);
    p5.background(0);
    p.background('#000000');
    const SW = STEP_W * 4;
    const SH = STEP_H * 4;

    let x = 0 + SW;
    const apothema = (Math.sqrt(3) * SH) / 2;

    while (x < CW * 4 + 3 * SW) {
      let y = 0;
      let row = 0;

      while (y < CH * 4 + apothema) {
        if (row % 2 !== 0) {
          p.push();
          p.translate(x - 1.5 * SW, y);
          p.rotate(randomRotation());
          drawHexagon(SW / 2, 0, 0);
          p.pop();
        } else {
          p.push();
          p.translate(x, y);
          p.rotate(randomRotation());
          drawHexagon(SW / 2, 0, 0);
          p.pop();
        }

        y += apothema;
        row += 1;
      }

      x += (3 * SW);
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

const Hexagon = () => {
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

export default Hexagon;
