import React, { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Indicator.css';

const Indicator = ({ size, colorIndicator, interval, ...etc }) => {
  const half = useMemo(() => size / 2, [size]);
  const canvas = useRef(null);
  useEffect(() => {
    canvas.current.width = size;
    canvas.current.height = size;
    const ctx = canvas.current.getContext('2d');
    ctx.strokeStyle = colorIndicator;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(half, half, half - 1.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }, [colorIndicator, half, size]);
  return <canvas ref={canvas} className="wave-slider-canvas" {...etc} />;
};

Indicator.propTypes = {
  colorIndicator: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  interval: PropTypes.number.isRequired,
};

export default Indicator;
