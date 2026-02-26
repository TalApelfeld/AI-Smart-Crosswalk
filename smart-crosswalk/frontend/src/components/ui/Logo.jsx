import React from 'react';
import PropTypes from 'prop-types';
import logoImage from './smart-crosswalk-logo.png';

/**
 * Logo — Smart Crosswalk product mark.
 * Height is derived from `size`; width is proportionally wider.
 *
 * @example
 * <Logo size={40} />
 */
const Logo = ({ size = 40 }) => {
  return (
    <img
      src={logoImage}
      alt="Smart Pedestrian Crossing"
      style={{
        width: size * 1.3,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
};

Logo.propTypes = {
  /** Base height in pixels (width is 1.3× height) */
  size: PropTypes.number,
};

export default Logo;
