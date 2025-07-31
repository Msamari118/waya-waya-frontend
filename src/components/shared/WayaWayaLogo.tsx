import React from 'react';

interface WayaWayaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const WayaWayaLogo: React.FC<WayaWayaLogoProps> = ({ size = 'sm', showText = true }) => {
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
      <div className={`${logoSizes[size]} bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center`}>
        <span className={`text-white font-bold ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-lg'}`}>W</span>
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-primary`}>WAYA WAYA!</span>
      )}
    </div>
  );
};