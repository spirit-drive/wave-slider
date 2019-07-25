import React, { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Indicator.css';

const Indicator = ({ size, colorIndicator, interval, slide, rotationStep, canvasInterval, isPause, ...etc }) => {
  const half = useMemo(() => size / 2, [size]);
  const arcStep = useMemo(() => ((2 * Math.PI) / interval) * canvasInterval, [canvasInterval, interval]);
  const intervalId = useRef(null);
  const count = useRef(0);
  const ctx = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    ctx.current = canvas.current.getContext('2d');
    ctx.current.strokeStyle = colorIndicator;
    ctx.current.lineWidth = 2;
  }, [colorIndicator]);

  useEffect(() => {
    count.current = 0;
    clearInterval(intervalId.current);
    ctx.current.clearRect(0, 0, size, size);
    const start = Math.random() * Math.PI * 2;
    if (!isPause) {
      intervalId.current = setInterval(() => {
        const angleStart = rotationStep * count.current + start;
        const angleEnd = arcStep * count.current;
        ctx.current.clearRect(0, 0, size, size);
        ctx.current.beginPath();
        ctx.current.arc(half, half, half - 1.5, angleStart, angleEnd + angleStart);
        ctx.current.stroke();
        ctx.current.closePath();
        ++count.current;
        if (angleEnd > 2 * Math.PI) {
          clearInterval(intervalId.current);
        }
        return () => clearInterval(intervalId.current);
      }, canvasInterval);
    }
  }, [isPause, size, arcStep, half, interval, slide, rotationStep, canvasInterval]);

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
