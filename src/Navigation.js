import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Indicator from './Indicator';
import './Navigation.css';

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
  withIndicator,
}) => {
  const styleNavButton = useMemo(() => ({ width: `${sizeNavButton}px`, height: `${sizeNavButton}px` }), [
    sizeNavButton,
  ]);
  const isCenter = useMemo(() => navigationPosition === 'center', [navigationPosition]);
  const margin = useMemo(() => (isCenter ? 'marginLeft' : 'marginTop'), [isCenter]);
  const translate = useMemo(() => (isCenter ? 'translateX' : 'translateY'), [isCenter]);

  const stylesNavButtons = useMemo(
    () =>
      Array(count)
        .fill()
        .map((_, i) => ({ [margin]: i ? `${indentBetweenNavButtons}px` : 0 })),
    [count, margin, indentBetweenNavButtons]
  );
  const stylePoints = useMemo(() => ({ width: `${sizePoints}px`, height: `${sizePoints}px` }), [sizePoints]);
  const getPointPosition = useCallback(
    number => ({ transform: `${translate}(${(indentBetweenNavButtons + sizeNavButton) * number}px)` }),
    [indentBetweenNavButtons, sizeNavButton, translate]
  );
  const styleForNavButtons = { ...styleNavButton, ...getPointPosition(slide) };
  return (
    <div className={cn('wave-slider-nav', `wave-slider-nav_${navigationPosition}`, classNameNav)}>
      {withIndicator && <Indicator style={styleForNavButtons} />}
      <div className={cn('wave-slider-nav__point-wrapper', classNameWrapperPoint)} style={styleForNavButtons}>
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
            style={{ ...styleNavButton, ...stylesNavButtons[i] }}
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
  withIndicator: PropTypes.bool,
};

Navigation.defaultProps = {
  classNameNav: undefined,
  classNamePoints: undefined,
  classNamePoint: undefined,
  classNameButtons: undefined,
  classNameWrapperPoint: undefined,
  withIndicator: true,
};

export default Navigation;
