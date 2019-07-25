import React, { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Indicator.css';

const Indicator = ({ size, colorIndicator, interval, slide, isPause, ...etc }) => {
  const half = useMemo(() => size / 2, [size]);
  const arcStep = useMemo(() => ((2 * Math.PI) / interval) * 10, [interval]);
  const intervalId = useRef(null);
  const count = useRef(0);
  const ctx = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    ctx.current = canvas.current.getContext('2d');
    ctx.current.strokeStyle = colorIndicator;
    ctx.current.lineWidth = 2;
  }, [colorIndicator, half, size]);

  useEffect(() => {
    count.current = 0;
    clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      const angle = arcStep * count.current;
      ctx.current.clearRect(0, 0, size, size);
      ctx.current.beginPath();
      ctx.current.arc(half, half, half - 1.5, 0, angle);
      ctx.current.stroke();
      ctx.current.closePath();
      if (!isPause) {
        ++count.current;
      }
      if (angle > 2 * Math.PI) {
        clearInterval(intervalId.current);
      }
      return () => clearInterval(intervalId.current);
    }, 10);
  }, [isPause, size, arcStep, half, interval, slide]);

  useEffect(() => {
    console.log(isPause);
  }, [isPause]);

  return <canvas ref={canvas} className="wave-slider-canvas" width={size} height={size} {...etc} />;
};

Indicator.propTypes = {
  colorIndicator: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  interval: PropTypes.number.isRequired,
  slide: PropTypes.number.isRequired,
  isPause: PropTypes.bool.isRequired,
};

export default Indicator;
