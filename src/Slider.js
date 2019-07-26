import React, { Fragment, useMemo, useState, useReducer, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Navigation from './Navigation';
import './Slider.css';

const Slider = ({
  className,
  classNameManageButtons,
  classNameNextButton,
  classNameBackButton,
  classNamePlayButton,
  classNameStopButton,
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
  playButtonText,
  stopButtonText,
  withManageButtons,
  nextButton: NextButton,
  backButton: BackButton,
  playButton: PlayButton,
  stopButton: StopButton,
  onChangeSlide,
  onPlaySlider,
  onStopSlider,
  ...navProps
}) => {
  const quantity = useMemo(() => children.length, [children]);

  const errorHandlerForInitialSlide = useCallback(() => {
    if (initialSlide < 0) {
      throw new Error(`invalid initialSlide: ${initialSlide}\ninitialSlide should be more or equal 0`);
    }

    if (initialSlide >= quantity) {
      throw new Error(`invalid initialSlide: ${initialSlide}\ninitialSlide should be less or equal ${quantity - 1}`);
    }
  }, [initialSlide, quantity]);

  const errorHandlerForNavigationPosition = useCallback(() => {
    if (
      navProps.navigationPosition !== 'center' &&
      navProps.navigationPosition !== 'left' &&
      navProps.navigationPosition !== 'right'
    ) {
      throw new Error(
        `invalid navigationPosition: ${navProps.navigationPosition}\nnavigationPosition should be 'center', 'left' or 'right'`
      );
    }
  }, [navProps.navigationPosition]);

  useMemo(errorHandlerForInitialSlide, [errorHandlerForInitialSlide]);
  useMemo(errorHandlerForNavigationPosition, [errorHandlerForNavigationPosition]);

  const [isPause, setPause] = useState(!autoPlay);

  const reducer = useCallback(
    (state, action) => {
      switch (action.type) {
        case 'next':
          if (state + 1 === quantity) return 0;
          return state + 1;

        case 'back':
          if (state === 0) return quantity - 1;
          return state - 1;

        case 'to':
          return action.payload;

        default:
          throw new Error(`invalid type: ${action.type}`);
      }
    },
    [quantity]
  );

  const [slide, setSlide] = useReducer(reducer, initialSlide);

  const zIndex = useRef(0);
  const intervalId = useRef(-1);
  const clickPos = useRef(null);
  const prevSlide = useRef(-1);
  const slides = useRef(children.map(() => React.createRef()));
  const slider = useRef(null);

  const next = useCallback(() => setSlide({ type: 'next' }), []);

  const back = useCallback(() => setSlide({ type: 'back' }), []);

  const move = useMemo(() => (isReverse ? back : next), [isReverse, back, next]);

  const clear = useMemo(() => (autoPlay ? () => clearInterval(intervalId.current) : () => {}), [autoPlay]);

  // eslint-disable-next-line no-return-assign
  const start = useMemo(() => (autoPlay ? () => (intervalId.current = setInterval(move, interval)) : () => {}), [
    autoPlay,
    interval,
    move,
  ]);

  const stop = useMemo(() => (autoPlay ? () => setPause(true) : () => {}), [autoPlay]);

  const play = useMemo(() => (autoPlay ? () => setPause(false) : () => {}), [autoPlay]);

  const createChange = useCallback(
    callback => () => {
      clear();
      callback();
      if (!isPause) start();
    },
    [clear, isPause, start]
  );

  const toSlide = useMemo(() => payload => createChange(() => setSlide({ type: 'to', payload })), [createChange]);

  const nextEnhance = useMemo(() => createChange(next), [createChange, next]);

  const backEnhance = useMemo(() => createChange(back), [createChange, back]);

  const swipeStart = useCallback(
    e => {
      clickPos.current = e.clientX || e.touches[0].clientX;
      stop();
    },
    [stop]
  );

  const swipeEnd = useCallback(
    e => {
      clickPos.current = null;
      if (e.touches || !stopOnHover) play();
    },
    [play, stopOnHover]
  );

  const swipeMove = useCallback(
    e => {
      if (clickPos.current === null) return;
      const clientX = e.clientX || e.touches[0].clientX;
      const d = clientX - clickPos.current;
      if (Math.abs(d) > offsetForSwipeStep) {
        if (d > 0) nextEnhance();
        else backEnhance();
        clickPos.current = clientX;
      }
    },
    [offsetForSwipeStep, nextEnhance, backEnhance]
  );

  useEffect(() => {
    if (typeof onChangeSlide === 'function') {
      onChangeSlide({ type: 'change', currentSlide: slide, prevSlide: prevSlide.current });
    }
  }, [slide]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPause) {
      clear();
      if (typeof onStopSlider === 'function') {
        onStopSlider({ type: 'stop' });
      }
    } else {
      start();
      if (typeof onPlaySlider === 'function') {
        onPlaySlider({ type: 'play' });
      }
    }
  }, [clear, isPause, onPlaySlider, onStopSlider, start]);

  useEffect(() => {
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
      // for some browsers
      setTimeout(() => {
        style.transition = `width ${transitionDuration}ms ${transitionTimingFunction}`;
        style.width = '100%';
      }, 50);
    });
  }, [slide, autoPlay, transitionDuration, transitionTimingFunction]);

  useEffect(() => {
    play();
    window.addEventListener('focus', play);
    window.addEventListener('blur', stop);

    return () => {
      clear();
      window.removeEventListener('focus', play);
      window.removeEventListener('blur', stop);
    };
  }, [play, clear, stop]);

  useEffect(() => {
    if (withFixedWidth) {
      const setWidthForSlides = () => {
        const { width } = getComputedStyle(slider.current);
        slides.current.forEach(item => (item.current.children[0].style.width = width)); // eslint-disable-line no-param-reassign, no-return-assign
      };

      setWidthForSlides();
      window.addEventListener('resize', setWidthForSlides);

      return () => {
        window.removeEventListener('resize', setWidthForSlides);
      };
    }
    return undefined;
  }, [withFixedWidth]);

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
  }, [withSwipe, swipeStart, swipeMove, swipeEnd]);

  return (
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
          quantity={quantity}
          toSlide={toSlide}
          autoPlay={autoPlay}
          interval={interval}
          isPause={isPause}
          {...navProps}
        />
      )}
      {withManageButtons && (
        <Fragment>
          <BackButton className={cn(classNameManageButtons, classNameBackButton)} onClick={backEnhance}>
            {backButtonText}
          </BackButton>
          <NextButton className={cn(classNameManageButtons, classNameNextButton)} onClick={nextEnhance}>
            {nextButtonText}
          </NextButton>
          {PlayButton && (
            <PlayButton className={cn(classNameManageButtons, classNamePlayButton)} onClick={play}>
              {playButtonText}
            </PlayButton>
          )}
          {StopButton && (
            <StopButton className={cn(classNameManageButtons, classNameStopButton)} onClick={stop}>
              {stopButtonText}
            </StopButton>
          )}
        </Fragment>
      )}
    </div>
  );
};

Slider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]).isRequired,
  nextButton: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  backButton: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  playButton: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  stopButton: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]),
  nextButtonText: PropTypes.string,
  backButtonText: PropTypes.string,
  playButtonText: PropTypes.string,
  stopButtonText: PropTypes.string,
  className: PropTypes.string,
  classNameNav: PropTypes.string,
  classNamePoints: PropTypes.string,
  classNamePoint: PropTypes.string,
  classNameButtons: PropTypes.string,
  classNameWrapperPoint: PropTypes.string,
  classNameManageButtons: PropTypes.string,
  classNameNextButton: PropTypes.string,
  classNameBackButton: PropTypes.string,
  classNamePlayButton: PropTypes.string,
  classNameStopButton: PropTypes.string,
  interval: PropTypes.number,
  canvasInterval: PropTypes.number,
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
  rotationStep: PropTypes.number,
  indentBetweenNavButtons: PropTypes.number,
  onChangeSlide: PropTypes.func,
  onPlaySlider: PropTypes.func,
  onStopSlider: PropTypes.func,
  colorIndicator: PropTypes.string,
};

Slider.defaultProps = {
  nextButton: 'button',
  backButton: 'button',
  playButton: 'button',
  stopButton: 'button',
  nextButtonText: 'next',
  backButtonText: 'back',
  playButtonText: 'play',
  stopButtonText: 'stop',
  className: undefined,
  classNameNav: undefined,
  classNamePoints: undefined,
  classNamePoint: undefined,
  classNameButtons: undefined,
  classNameWrapperPoint: undefined,
  classNameManageButtons: undefined,
  classNameNextButton: undefined,
  classNameBackButton: undefined,
  classNamePlayButton: undefined,
  classNameStopButton: undefined,
  interval: 1000,
  canvasInterval: 30,
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
  stopOnHover: false,
  navigationPosition: 'center',
  sizeNavButton: 35,
  indentBetweenNavButtons: 15,
  sizePoints: 10,
  rotationStep: Math.PI / 50,
  onChangeSlide: undefined,
  onPlaySlider: undefined,
  onStopSlider: undefined,
  colorIndicator: '#fff',
};

export default Slider;
