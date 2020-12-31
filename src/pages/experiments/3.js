import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const initCanvas = () => {
  let mouse_pos = { x: 0, y: 0 };

  const canvas = new fabric.Canvas('canvas', {
    height: 800,
    width: 800,
  });

  function resizeCanvas() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, false);

  const maxx = canvas.width;
  const maxy = canvas.height;
  const total = 100;
  const particles = new Array(total);

  function animate() {
    for (let i = 0; i < total; i += 1) {
      const particle = particles[i];
      const dx = particle.left - mouse_pos.x;
      const dy = particle.top - mouse_pos.y;
      let { vx, vy } = particle;

      // limit acceleration
      if (dx * dx + dy * dy <= 10000) {
        vx += dx * 0.1;
        vy += dy * 0.1;
      }

      vx *= 0.99;
      vy *= 0.99;

      vx += Math.random() - 0.5;
      vy += Math.random() - 0.5;

      particle.left += vx;
      particle.top += vy;

      const x = particle.left;
      const y = particle.top;

      if (x < 0 || x > maxx || y < 0 || y > maxy) {
        const r = Math.atan2(y - maxy / 2, x - maxx / 2);
        vx = -Math.cos(r);
        vy = -Math.sin(r);
      }

      particle.vx = vx;
      particle.vy = vy;
    }

    fabric.util.requestAnimFrame(animate, canvas.getElement());
    canvas.renderAll();
  }

  function loadCursors(img) {
    for (let i = 0; i < total; i += 1) {
      const randomCursor = new fabric.Image(img.getElement(), {
        left: Math.random() * maxx,
        top: Math.random() * maxy,
        selectable: false,
      });
      randomCursor.vx = 0;
      randomCursor.vy = 0;
      canvas.add(randomCursor);
      particles[i] = randomCursor;
    }
    animate();
  }

  canvas.on('mouse:move', (options) => {
    mouse_pos = canvas.getPointer(options.e);
    console.info(mouse_pos);
  });

  fabric.Image.fromURL('/assets/20-cursor.png', loadCursors);
  // canvas.renderAll();
  // fabric.util.requestAnimFrame(animate, canvas.getElement());

  return canvas;
};

const SocialDistancing = () => {
  const [canvas, setCanvas] = useState('');
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  return (
    <>
      <style global jsx>{`
        * {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        canvas {
          display: inline-block;
        }
      `}</style>
      <h1>Social Distancing on the Web</h1>
      <canvas id="canvas" />
    </>
  );
};

export default SocialDistancing;
