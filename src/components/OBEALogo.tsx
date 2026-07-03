import React from 'react';

interface OBEALogoProps {
  variant?: 'vertical' | 'horizontal' | 'symbol';
  className?: string;
  lightMode?: boolean; // true if rendering on dark background (white logo/text)
}

export const OBEALogo: React.FC<OBEALogoProps> = ({ 
  variant = 'vertical', 
  className = '', 
  lightMode = false 
}) => {
  const darkGreen = lightMode ? '#ffffff' : '#0E3B2E';
  const subtextColor = lightMode ? '#e4e4e7' : '#27272a';

  if (variant === 'symbol') {
    return (
      <img 
        src="/obea-symbol.png" 
        alt="OBEA Símbolo" 
        className={`${className || 'h-16 w-16'} object-contain shrink-0`} 
      />
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src="/obea-symbol.png" 
          alt="OBEA Símbolo" 
          className="h-11 w-11 object-contain shrink-0" 
        />
        <div className="border-l border-zinc-200 dark:border-zinc-800 pl-3 flex flex-col justify-center">
          <span 
            className="text-lg font-black tracking-[0.25em] leading-none"
            style={{ color: darkGreen }}
          >
            OBEA
          </span>
          <span 
            className="text-[8px] font-bold mt-1 tracking-wider uppercase"
            style={{ color: subtextColor }}
          >
            Observatório do Bem-Estar Animal
          </span>
        </div>
      </div>
    );
  }

  // Default: Vertical (Principal version)
  // We use the exact official logo image uploaded by the user
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src="/obea-logo.png" 
        alt="OBEA - Observatório do Bem-Estar Animal" 
        className="max-h-56 sm:max-h-64 w-auto object-contain hover:scale-102 transition-transform duration-300 dark:invert-0" 
      />
    </div>
  );
};
