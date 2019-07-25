import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Indicator.css';

const drawArc = (context, size, radius, start, end) => {
  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.arc(radius, radius, radius - 1.5, start, end);
  context.stroke();
  context.closePath();
};

const Indicator = ({ size, colorIndicator, interval, slide, rotationStep, canvasInterval, isPause, ...etc }) => {
  const half = useMemo(() => size / 2, [size]);
  const arcStep = useMemo(() => ((2 * Math.PI) / interval) * canvasInterval, [canvasInterval, interval]);
  const intervalId = useRef(null);
  const count = useRef(0);
  const ctx = useRef(null);
  const canvas = useRef(null);

  const draw = useCallback(() => {
    if (!isPause) {
      const start = Math.random() * Math.PI * 2;
      intervalId.current = setInterval(() => {
        const angleStart = rotationStep * count.current + start;
        const angleEnd = arcStep * count.current;
        drawArc(ctx.current, size, half, angleStart, angleEnd + angleStart);
        ++count.current;
        if (angleEnd > 2 * Math.PI) {
          clearInterval(intervalId.current);
        }
      }, canvasInterval);
    }
  }, [arcStep, canvasInterval, half, isPause, rotationStep, size]);

  const clear = useCallback(() => {
    count.current = 0;
    clearInterval(intervalId.current);
    ctx.current.clearRect(0, 0, size, size);
  }, [size]);

  useEffect(() => {
    ctx.current = canvas.current.getContext('2d');
    ctx.current.strokeStyle = colorIndicator;
    ctx.current.lineWidth = 2;
  }, [colorIndicator]);

  useEffect(() => {
    draw();
    return clear;
  }, [isPause, slide, clear, draw]);

  return <canvas ref={canvas} className="wave-slider-canvas" width={size} height={size} {...etc} />;
};

Indicator.propTypes = {
  colorIndicator: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  canvasInterval: PropTypes.number.isRequired,
  interval: PropTypes.number.isRequired,
  slide: PropTypes.number.isRequired,
  isPause: PropTypes.bool.isRequired,
  rotationStep: PropTypes.number.isRequired,
};

export default Indicator;
