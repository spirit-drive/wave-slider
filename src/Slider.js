import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './Slider.css';

const Navigation = ({
  count,
  toSlide,
  slide,
  sizeNavButton,
  sizePoints,
  indentBetweenNavButtons,
  navigationDirection,
  classNameNav,
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
  const shiftPoint = useMemo(() => (sizeNavButton - sizePoints) / 2, [sizePoints, sizeNavButton]);
  const stylePoint = useMemo(
    () => ({
      top: `${shiftPoint}px`,
      left: `${shiftPoint}px`,
    }),
    [shiftPoint]
  );
  const getPointPosition = useCallback(
    number => {
      if (navigationDirection === 'center') {
        return {
          transform: `translateX(${(shiftPoint + indentBetweenNavButtons * 2) * number}px)`,
        };
      }

      return {
        transform: `translateY(${(shiftPoint + indentBetweenNavButtons * 2) * number}px)`,
      };
    },
    [navigationDirection, sizeNavButton, indentBetweenNavButtons, sizePoints]
  );
  return (
    <div className={cn('wave-slider-nav', `wave-slider-nav_${navigationDirection}`, classNameNav)}>
      <div className="wave-slider-nav__point" style={{ ...stylePoints, ...stylePoint, ...getPointPosition(slide) }} />
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
  classNameNav: PropTypes.string,
};

Navigation.defaultProps = {
  classNameNav: undefined,
};

let zIndex = 0;

const Slider = ({ className, speedAnimation, typeAnimation, children, initialSlide, navigation, ...navProps }) => {
  const [slide, setSlide] = useState(initialSlide);
  const toSlide = useCallback(number => () => setSlide(number), []);
  const style = useMemo(() => ({ transition: `width ${speedAnimation}ms ${typeAnimation}` }), [
    speedAnimation,
    typeAnimation,
  ]);
  return (
    <div className={cn('wave-slider', className)}>
      <div style={style} className="wave-slider__wrapper">
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
  classNameNav: PropTypes.string,
  interval: PropTypes.number,
  initialSlide: PropTypes.number,
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
  classNameNav: undefined,
  interval: 5000,
  initialSlide: 0,
  speedAnimation: 300,
  typeAnimation: 'ease',
  navigation: true,
  navigationDirection: 'left',
  sizeNavButton: 30,
  indentBetweenNavButtons: 20,
  sizePoints: 10,
};

export default Slider;
