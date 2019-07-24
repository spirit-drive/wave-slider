import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
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
  navigationPosition,
  classNameNav,
  classNamePoints,
  classNamePoint,
  classNameButtons,
  classNameWrapperPoint,
}) => {
  const styleNavButton = useMemo(
    () => ({
      width: `${sizeNavButton}px`,
      height: `${sizeNavButton}px`,
    }),
    [sizeNavButton]
  );
  const getStyleNavButton = useCallback(
    i => ({
      [navigationPosition === 'center' ? 'marginLeft' : 'marginTop']: i ? `${indentBetweenNavButtons}px` : 0,
    }),
    [indentBetweenNavButtons, navigationPosition]
  );
  const stylePoints = useMemo(
    () => ({
      width: `${sizePoints}px`,
      height: `${sizePoints}px`,
    }),
    [sizePoints]
  );
  const getPointPosition = useCallback(
    number => {
      if (navigationPosition === 'center') {
        return {
          transform: `translateX(${(indentBetweenNavButtons + sizeNavButton) * number}px)`,
        };
      }

      return {
        transform: `translateY(${(indentBetweenNavButtons + sizeNavButton) * number}px)`,
      };
    },
    [navigationPosition, indentBetweenNavButtons, sizeNavButton]
  );
  return (
    <div className={cn('wave-slider-nav', `wave-slider-nav_${navigationPosition}`, classNameNav)}>
      <div
        className={cn('wave-slider-nav__point-wrapper', classNameWrapperPoint)}
        style={{ ...styleNavButton, ...getPointPosition(slide) }}
      >
        <div className={cn('wave-slider-nav__point', classNamePoints, classNamePoint)} style={stylePoints} />
      </div>
      {Array(count)
        .fill()
        .map((_, i) => (
          <button
            key={i} // eslint-disable-line react/no-array-index-key
            className={cn('wave-slider-nav__item', i === slide && 'wave-slider-nav__item_active', classNameButtons)}
            type="button"
            onClick={toSlide(i)}
            style={{ ...styleNavButton, ...getStyleNavButton(i) }}
          >
            <span className={cn('wave-slider-nav__points', classNamePoints)} style={stylePoints} />
          </button>
        ))}
    </div>
  );
};

Navigation.propTypes = {
  count: PropTypes.number.isRequired,
  slide: PropTypes.number.isRequired,
  toSlide: PropTypes.func.isRequired,
  navigationPosition: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  sizeNavButton: PropTypes.number.isRequired,
  sizePoints: PropTypes.number.isRequired,
  indentBetweenNavButtons: PropTypes.number.isRequired,
  classNameNav: PropTypes.string,
  classNamePoints: PropTypes.string,
  classNamePoint: PropTypes.string,
  classNameButtons: PropTypes.string,
  classNameWrapperPoint: PropTypes.string,
};

Navigation.defaultProps = {
  classNameNav: undefined,
  classNamePoints: undefined,
  classNamePoint: undefined,
  classNameButtons: undefined,
  classNameWrapperPoint: undefined,
};

let zIndex = 0;
let intervalId = null;
let prevSlide = -1;

const Slider = ({
  className,
  transitionDuration,
  transitionTimingFunction,
  children,
  initialSlide,
  navigation,
  interval,
  isReverse,
  stopOnHover,
  autoPlay,
  ...navProps
}) => {
  const [slide, setSlide] = useState(initialSlide);
  const toSlide = useCallback(number => () => setSlide(number), []);
  const count = useMemo(() => children.length, [children]);

  const next = useCallback(() => {
    setSlide(v => {
      const increase = v + 1;
      if (increase === count) return 0;
      return increase;
    });
  }, [count]);

  const back = useCallback(() => {
    setSlide(v => {
      const decrease = v - 1;
      if (decrease === -1) return count - 1;
      return decrease;
    });
  }, [count]);

  const move = useCallback(() => {
    if (isReverse) {
      return back();
    }

    return next();
  }, [isReverse, back, next]);

  const stop = useCallback(() => {
    clearInterval(intervalId);
    intervalId = null;
  }, []);

  const play = useCallback(() => {
    stop();
    intervalId = setInterval(move, interval);
  }, [interval, move, stop]);

  const smartPlay = useCallback(() => {
    if (autoPlay) play();
  }, [autoPlay, play]);

  const slides = useRef(children.map(() => React.createRef()));
  const slider = useRef(null);
  const setWidthForSlides = useCallback(() => {
    slides.current.forEach(item => {
      const { width } = getComputedStyle(slider.current);
      // eslint-disable-next-line no-param-reassign
      item.current.children[0].style.width = width;
    });
  }, [slider, slides]);

  useEffect(() => {
    const block = slides.current[slide].current;
    block.style.transition = 'none';
    block.style.width = '0%';
    if (prevSlide > slide) {
      block.style.left = 'auto';
      block.children[0].style.float = 'right';
    } else {
      block.style.left = 0;
      block.children[0].style.float = 'none';
    }
    prevSlide = slide;
    block.style.zIndex = ++zIndex;
    requestAnimationFrame(() => {
      block.style.transition = `width ${transitionDuration}ms ${transitionTimingFunction}`;
      block.style.width = '100%';
    });
  }, [slide, transitionDuration, transitionTimingFunction]);

  useEffect(() => {
    smartPlay();
    setWidthForSlides();
    window.addEventListener('resize', setWidthForSlides);
    window.addEventListener('focus', smartPlay);
    window.addEventListener('blur', stop);

    return () => {
      stop();
      window.removeEventListener('resize', setWidthForSlides);
      window.removeEventListener('focus', smartPlay);
      window.removeEventListener('blur', stop);
    };
  }, []);

  return (
    <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
      className={cn('wave-slider', className)}
      ref={slider}
      onMouseOver={stopOnHover ? stop : null}
      onMouseOut={stopOnHover ? smartPlay : null}
    >
      <div className="wave-slider__wrapper">
        {children
          .map((item, i) => (
            <div
              ref={slides.current[i]}
              key={i} // eslint-disable-line react/no-array-index-key
              className="wave-slider__slide"
            >
              {item}
            </div>
          ))
          .reverse()}
      </div>
      {navigation && <Navigation slide={slide} count={count} toSlide={toSlide} {...navProps} />}
      <button type="button" onClick={next}>
        next
      </button>
      <button type="button" onClick={back}>
        back
      </button>
    </div>
  );
};

Slider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]).isRequired,
  className: PropTypes.string,
  classNameNav: PropTypes.string,
  interval: PropTypes.number,
  initialSlide: PropTypes.number,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  navigation: PropTypes.bool,
  autoPlay: PropTypes.bool,
  isReverse: PropTypes.bool,
  stopOnHover: PropTypes.bool,
  navigationPosition: PropTypes.oneOf(['center', 'left', 'right']),
  sizeNavButton: PropTypes.number,
  sizePoints: PropTypes.number,
  indentBetweenNavButtons: PropTypes.number,
  classNamePoints: PropTypes.string,
  classNamePoint: PropTypes.string,
  classNameButtons: PropTypes.string,
  classNameWrapperPoint: PropTypes.string,
};

Slider.defaultProps = {
  className: undefined,
  classNameNav: undefined,
  interval: 1000,
  initialSlide: 0,
  transitionDuration: 800,
  transitionTimingFunction: 'ease',
  navigation: true,
  autoPlay: true,
  isReverse: false,
  stopOnHover: true,
  navigationPosition: 'right',
  sizeNavButton: 35,
  indentBetweenNavButtons: 30,
  sizePoints: 10,
  classNamePoints: undefined,
  classNamePoint: undefined,
  classNameButtons: undefined,
  classNameWrapperPoint: undefined,
};

export default Slider;
