import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './Slider.css';

const navigationDirections = {
  center: {
    left: '50%',
    bottom: '50px',
    transform: 'translateX(-50%)',
  },
  left: {
    top: '50%',
    left: '50px',
    transform: 'translateY(-50%)',
    flexDirection: 'column',
  },
  right: {
    top: '50%',
    right: '50px',
    transform: 'translateY(-50%)',
    flexDirection: 'column',
  },
};

const Navigation = ({
  count,
  toSlide,
  slide,
  sizeNavButton,
  sizePoints,
  indentBetweenNavButtons,
  navigationDirection,
}) => {
  const getStyleNavButton = useCallback(
    i => ({
      width: `${sizeNavButton}px`,
      height: `${sizeNavButton}px`,
      [navigationDirection === 'center' ? 'marginLeft' : 'marginTop']: i ? `${indentBetweenNavButtons}px` : 0,
    }),
    [sizeNavButton, indentBetweenNavButtons, navigationDirection]
  );
  const stylePoints = useMemo(
    () => ({
      width: `${sizePoints}px`,
      height: `${sizePoints}px`,
    }),
    [sizePoints]
  );
  const styleNav = useMemo(() => navigationDirections[navigationDirection], [navigationDirection]);
  return (
    <div className="wave-slider-nav" style={styleNav}>
      {/* <div className="wave-slider-nav__point" /> */}
      {Array(count)
        .fill()
        .map((_, i) => (
          <button
            className={cn('wave-slider-nav__item', i === slide && 'wave-slider-nav__item_active')}
            type="button"
            onClick={toSlide(i)}
            style={getStyleNavButton(i)}
          >
            <span className="wave-slider-nav__points" style={stylePoints} />
          </button>
        ))}
    </div>
  );
};

Navigation.propTypes = {
  count: PropTypes.number.isRequired,
  slide: PropTypes.number.isRequired,
  toSlide: PropTypes.func.isRequired,
  navigationDirection: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  sizeNavButton: PropTypes.number.isRequired,
  sizePoints: PropTypes.number.isRequired,
  indentBetweenNavButtons: PropTypes.number.isRequired,
};

let zIndex = 0;

const Slider = ({
  className,
  height,
  speedAnimation,
  typeAnimation,
  children,
  initialSlide,
  navigation,
  ...navProps
}) => {
  const [slide, setSlide] = useState(initialSlide);
  const toSlide = useCallback(number => () => setSlide(number), []);
  const style = useMemo(() => ({ height: `${height}px`, transition: `height ${speedAnimation}ms ${typeAnimation}` }), [
    height,
    speedAnimation,
    typeAnimation,
  ]);
  return (
    <div style={style} className={cn('wave-slider', className)}>
      <div className="wave-slider__wrapper">
        {children
          .map((item, i) => (
            <div style={i === slide ? { zIndex: ++zIndex } : null} className="wave-slider__slide">
              {item}
            </div>
          ))
          .reverse()}
      </div>
      {navigation && <Navigation slide={slide} count={children.length} toSlide={toSlide} {...navProps} />}
    </div>
  );
};

Slider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]).isRequired,
  className: PropTypes.string,
  interval: PropTypes.number,
  initialSlide: PropTypes.number,
  height: PropTypes.number,
  speedAnimation: PropTypes.number,
  typeAnimation: PropTypes.string,
  navigation: PropTypes.bool,
  navigationDirection: PropTypes.oneOf(['center', 'left', 'right']),
  sizeNavButton: PropTypes.number,
  sizePoints: PropTypes.number,
  indentBetweenNavButtons: PropTypes.number,
};

Slider.defaultProps = {
  className: undefined,
  interval: 5000,
  initialSlide: 0,
  height: 500,
  speedAnimation: 300,
  typeAnimation: 'ease',
  navigation: true,
  navigationDirection: 'center',
  sizeNavButton: 30,
  indentBetweenNavButtons: 20,
  sizePoints: 10,
};

export default Slider;
