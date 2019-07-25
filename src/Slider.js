import React, { Fragment, useMemo, useState, useReducer, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Navigation from './Navigation';
import './Slider.css';

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
  nextButtonText,
  backButtonText,
  classNameManageButtons,
  classNameNextButton,
  classNameBackButton,
  withManageButtons,
  nextButton: NextButton,
  backButton: BackButton,
  onChangeSlide,
  ...navProps
}) => {
  const zIndex = useRef(0);
  const intervalId = useRef(null);
  const clickPos = useRef(null);
  const prevSlide = useRef(-1);
  const [isPause, setPause] = useState(!autoPlay);

  const swipeStart = useCallback(
    e => {
      clickPos.current = e.clientX || e.touches[0].clientX;
    },
    [clickPos]
  );

  const swipeEnd = useCallback(() => {
    clickPos.current = null;
  }, [clickPos]);

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

  const stop = useMemo(() => (autoPlay ? () => clearTimeout(intervalId.current) : () => {}), [autoPlay]);

  const play = useMemo(
    () =>
      autoPlay
        ? () => {
            stop();
            setPause(false);
            intervalId.current = setTimeout(move, interval);
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
            if (clickPos.current === null) return;
            const clientX = e.clientX || e.touches[0].clientX;
            const d = clientX - clickPos.current;
            if (Math.abs(d) > offsetForSwipeStep) {
              if (d > 0) next();
              else back();
              clickPos.current = clientX;
            }
          }
        : () => {},
    [withSwipe, next, back, offsetForSwipeStep]
  );

  useEffect(() => {
    if (typeof onChangeSlide === 'function') {
      onChangeSlide({ currentSlide: slide, prevSlide: prevSlide.current });
    }
    const {
      style,
      children: [child],
    } = slides.current[slide].current;

    style.transition = 'none';
    style.width = '0%';
    if (prevSlide.current > slide) {
      style.left = 'auto';
      child.style.float = 'right';
    } else {
      style.left = 0;
      child.style.float = 'none';
    }
    prevSlide.current = slide;
    style.zIndex = ++zIndex.current;
    requestAnimationFrame(() => {
      setTimeout(() => {
        style.transition = `width ${transitionDuration}ms ${transitionTimingFunction}`;
        style.width = '100%';
      }, 50);
    });
  }, [onChangeSlide, slide, transitionDuration, transitionTimingFunction]);

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

  const onMouseOver = useCallback(() => {
    stop();
    setPause(true);
  }, [stop]);

  const handlersForTotalSlider = useMemo(() => {
    if (stopOnHover) {
      return {
        onMouseOver,
        onMouseOut: play,
      };
    }

    return {};
  }, [stopOnHover, onMouseOver, play]);

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
  }, [withSwipe, swipeStart, swipeMove, swipeEnd]);

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
      {navigation && (
        <Navigation
          slide={slide}
          count={count}
          toSlide={toSlide}
          autoPlay={autoPlay}
          interval={interval}
          isPause={isPause}
          {...navProps}
        />
      )}
      {withManageButtons && (
        <Fragment>
          <BackButton className={cn(classNameManageButtons, classNameBackButton)} onClick={back}>
            {backButtonText}
          </BackButton>
          <NextButton className={cn(classNameManageButtons, classNameNextButton)} onClick={next}>
            {nextButtonText}
          </NextButton>
        </Fragment>
      )}
    </div>
  );
};

Slider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]).isRequired,
  nextButton: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  backButton: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  className: PropTypes.string,
  classNameNav: PropTypes.string,
  interval: PropTypes.number,
  offsetForSwipeStep: PropTypes.number,
  initialSlide: PropTypes.number,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  navigation: PropTypes.bool,
  withIndicator: PropTypes.bool,
  withManageButtons: PropTypes.bool,
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
  classNameManageButtons: PropTypes.string,
  classNameNextButton: PropTypes.string,
  classNameBackButton: PropTypes.string,
  onChangeSlide: PropTypes.func,
  nextButtonText: PropTypes.string,
  backButtonText: PropTypes.string,
  colorIndicator: PropTypes.string,
};

Slider.defaultProps = {
  nextButton: 'button',
  backButton: 'button',
  className: undefined,
  classNameNav: undefined,
  interval: 1000,
  offsetForSwipeStep: 50,
  initialSlide: 0,
  transitionDuration: 800,
  transitionTimingFunction: 'ease',
  navigation: true,
  withIndicator: true,
  withManageButtons: true,
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
  classNameManageButtons: undefined,
  classNameNextButton: undefined,
  classNameBackButton: undefined,
  onChangeSlide: undefined,
  nextButtonText: 'next',
  backButtonText: 'back',
  colorIndicator: '#f25',
};

export default Slider;
