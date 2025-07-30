// src/components/common/WayaWayaLogo.tsx
// Waya Waya Logo Component

import React from 'react';
import { WayaWayaLogoProps } from '../../types';

export const WayaWayaLogo: React.FC<WayaWayaLogoProps> = ({ 
  size = 'sm', 
  showText = true 
}) => {
  const logoSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${logoSizes[size]} bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold`}>
        WW
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gray-900`}>
          Waya Waya
        </span>
      )}
    </div>
  );
};