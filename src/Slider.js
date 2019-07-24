import React, { useMemo, useReducer, useCallback, useEffect, useRef } from 'react';
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
  const styleNavButton = useMemo(() => ({ width: `${sizeNavButton}px`, height: `${sizeNavButton}px` }), [
    sizeNavButton,
  ]);
  const isCenter = useMemo(() => navigationPosition === 'center', [navigationPosition]);
  const margin = useMemo(() => (isCenter ? 'marginLeft' : 'marginTop'), [isCenter]);
  const translate = useMemo(() => (isCenter ? 'translateX' : 'translateY'), [isCenter]);

  const getStyleNavButton = useCallback(i => ({ [margin]: i ? `${indentBetweenNavButtons}px` : 0 }), [
    margin,
    indentBetweenNavButtons,
  ]);
  const stylePoints = useMemo(() => ({ width: `${sizePoints}px`, height: `${sizePoints}px` }), [sizePoints]);
  const getPointPosition = useCallback(
    number => ({ transform: `${translate}(${(indentBetweenNavButtons + sizeNavButton) * number}px)` }),
    [indentBetweenNavButtons, sizeNavButton, translate]
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
let clickPos = null;
let prevSlide = -1;

const swipeStart = e => {
  clickPos = e.clientX || e.touches[0].clientX;
};

const swipeEnd = () => {
  clickPos = null;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'next':
      if (state + 1 === action.payload) return 0;
      return state + 1;

    case 'back':
      if (state === 0) return action.payload - 1;
      return state - 1;

    default:
      return action.payload;
  }
};

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
  offsetForSwipeStep,
  withSwipe,
  withFixedWidth,
  ...navProps
}) => {
  const [slide, setSlide] = useReducer(reducer, initialSlide);
  const toSlide = useCallback(payload => () => setSlide({ payload }), []);
  const count = useMemo(() => children.length, [children]);

  const next = useCallback(() => {
    setSlide({ type: 'next', payload: count });
    play();
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = useCallback(() => {
    setSlide({ type: 'back', payload: count });
    play();
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  const move = useMemo(() => (isReverse ? back : next), [isReverse, back, next]);

  const stop = useMemo(() => (autoPlay ? () => clearTimeout(intervalId) : () => {}), [autoPlay]);

  const play = useMemo(
    () =>
      autoPlay
        ? () => {
            stop();
            intervalId = setTimeout(move, interval);
          }
        : () => {},
    [autoPlay, interval, move, stop]
  );

  const slides = useRef(children.map(() => React.createRef()));
  const slider = useRef(null);

  const setWidthForSlides = useCallback(() => {
    const { width } = getComputedStyle(slider.current);
    // eslint-disable-next-line no-param-reassign,no-return-assign
    slides.current.forEach(item => (item.current.children[0].style.width = width));
  }, [slider, slides]);

  const swipeMove = useMemo(
    () =>
      withSwipe
        ? e => {
            if (clickPos === null) return;
            const clientX = e.clientX || e.touches[0].clientX;
            const d = clientX - clickPos;
            if (Math.abs(d) > offsetForSwipeStep) {
              if (d > 0) next();
              else back();
              clickPos = clientX;
            }
          }
        : () => {},
    [withSwipe, next, back, offsetForSwipeStep]
  );

  useEffect(() => {
    const {
      style,
      children: [child],
    } = slides.current[slide].current;

    style.transition = 'none';
    style.width = '0%';
    if (prevSlide > slide) {
      style.left = 'auto';
      child.style.float = 'right';
    } else {
      style.left = 0;
      child.style.float = 'none';
    }
    prevSlide = slide;
    style.zIndex = ++zIndex;
    requestAnimationFrame(() => {
      setTimeout(() => {
        style.transition = `width ${transitionDuration}ms ${transitionTimingFunction}`;
        style.width = '100%';
      }, 50);
    });
  }, [slide, transitionDuration, transitionTimingFunction]);

  useEffect(() => {
    play();
    window.addEventListener('focus', play);
    window.addEventListener('blur', stop);

    return () => {
      stop();
      window.removeEventListener('focus', play);
      window.removeEventListener('blur', stop);
    };
  }, [setWidthForSlides, play, stop]);

  useEffect(() => {
    if (withFixedWidth) {
      setWidthForSlides();
      window.addEventListener('resize', setWidthForSlides);

      return () => {
        window.removeEventListener('resize', setWidthForSlides);
      };
    }
    return undefined;
  }, [withFixedWidth, setWidthForSlides]);

  const handlersForTotalSlider = useMemo(() => {
    if (stopOnHover) {
      return {
        onMouseOver: stop,
        onMouseOut: play,
      };
    }

    return {};
  }, [stopOnHover, stop, play]);

  const handlersForSliderWrapper = useMemo(() => {
    if (withSwipe) {
      return {
        onMouseDown: swipeStart,
        onTouchStart: swipeStart,
        onMouseMove: swipeMove,
        onTouchMove: swipeMove,
        onMouseUp: swipeEnd,
        onTouchEnd: swipeEnd,
      };
    }

    return {};
  }, [withSwipe, swipeMove]);

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div className={cn('wave-slider', className)} ref={slider} {...handlersForTotalSlider}>
      <div role="presentation" className="wave-slider__wrapper" {...handlersForSliderWrapper}>
        {children.map((item, i) => (
          <div
            ref={slides.current[i]}
            key={i} // eslint-disable-line react/no-array-index-key
            className="wave-slider__slide"
          >
            {item}
          </div>
        ))}
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
  offsetForSwipeStep: PropTypes.number,
  initialSlide: PropTypes.number,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  navigation: PropTypes.bool,
  withFixedWidth: PropTypes.bool,
  withSwipe: PropTypes.bool,
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
  offsetForSwipeStep: 50,
  initialSlide: 0,
  transitionDuration: 800,
  transitionTimingFunction: 'ease',
  navigation: true,
  withFixedWidth: true,
  withSwipe: true,
  autoPlay: true,
  isReverse: false,
  stopOnHover: true,
  navigationPosition: 'center',
  sizeNavButton: 35,
  indentBetweenNavButtons: 15,
  sizePoints: 10,
  classNamePoints: undefined,
  classNamePoint: undefined,
  classNameButtons: undefined,
  classNameWrapperPoint: undefined,
};

export default Slider;
