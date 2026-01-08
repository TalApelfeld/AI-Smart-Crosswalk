import React from 'react';
import logoImage from './smart-crosswalk-logo.png';

/**
 * Smart Crosswalk Logo Component
 * Uses the actual Smart Pedestrian Crossing logo image
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
        verticalAlign: 'middle' 
      }}
    />
  );
};

export default Logo;
