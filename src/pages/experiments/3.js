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

  let maxx = canvas.width;
  let maxy = canvas.height;
  const total = 100;
  const particles = new Array(total);

  function animate() {
    maxx = canvas.width;
    maxy = canvas.height;
    // eslint-disable-next-line no-restricted-syntax
    for (const particle of particles) {
      const dx = particle.left - mouse_pos.x;
      const dy = particle.top - mouse_pos.y;
      let { vx, vy, ax, ay } = particle; // consider switching coordinate systems to v, theta

      // limit distance to cursor
      if (dx * dx + dy * dy <= 100000) {
        ax += dx * 0.01;
        ay += dy * 0.01;
      }

      // center gravity
      const dxCenter = (maxx / 2 - particle.left) / maxx;
      const dyCenter = (maxy / 2 - particle.top) / maxy;

      ax = ax * 0.99 + 0.25 * dxCenter + 0.05 * (Math.random() - 0.5);
      ay = ay * 0.99 + 0.25 * dyCenter + 0.05 * (Math.random() - 0.5);

      vx = vx * 0.99 + (ax > 0 ? ax * ax : -ax * ax);
      vy = vy * 0.99 + (ay > 0 ? ay * ay : -ay * ay);
      particle.left += vx;
      particle.top += vy;

      if (particle.top > maxy || particle.top < 0) particle.ay = -particle.ay;
      if (particle.left > maxx || particle.left < 0) particle.ax = -particle.ax;
      /*
      if (x < 0 || x > maxx || y < 0 || y > maxy) {
        const r = Math.atan2(y - maxy / 2, x - maxx / 2);
        vx = -Math.cos(r);
        vy = -Math.sin(r);
      } */

      particle.vx = vx;
      particle.vy = vy;
    }

    fabric.util.requestAnimFrame(animate, canvas.getElement());
    canvas.renderAll();
  }

  function loadCursors(img) {
    for (let i = 0; i < total; i += 1) {
      const particle = new fabric.Image(img.getElement(), {
        left: Math.random() * maxx,
        top: Math.random() * maxy,
        selectable: false,
      });
      particle.vx = 0;
      particle.vy = 0;
      particle.ax = 0.1 * (Math.random() - 0.5);
      particle.ay = 0.1 * (Math.random() - 0.5);
      canvas.add(particle);
      particles[i] = particle;
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
