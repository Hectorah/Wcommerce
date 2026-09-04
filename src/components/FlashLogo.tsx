import React from 'react';

interface FlashLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'auto' | 'dark' | 'light';
  showSubtitle?: boolean;
  className?: string;
}

export const FlashLogo: React.FC<FlashLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-6 sm:h-8',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const textColorClass =
    variant === 'light'
      ? 'fill-slate-950'
      : variant === 'dark'
      ? 'fill-white'
      : 'fill-slate-950 dark:fill-white';

  return (
    <div className={`flex flex-col items-center select-none font-sans ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" className={`${sizeMap[size]} w-auto`}>
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Isotipo */}
        <g transform="translate(10, 35)">
          <path d="M 20 30 L 48 125 C 50 132 60 132 62 125 L 85 55 C 87 49 95 49 97 55 L 120 125 C 122 132 132 132 134 125 L 150 70 C 151 65 156 62 161 64 L 163 65 C 168 67 170 72 168 77 L 146 142 C 140 160 114 160 108 142 L 91 90 L 74 142 C 68 160 42 160 36 142 L 8 42 C 6 35 12 28 20 30 Z" fill="url(#blueGrad)"/>
          <path d="M 130 35 L 165 35 C 172 35 177 40 178 47 L 180 58 C 181 65 175 70 168 70 L 140 70 Z" fill="url(#greenGrad)" opacity="0.95"/>
          <circle cx="70" cy="165" r="7" fill="#1D4ED8"/>
          <circle cx="130" cy="165" r="7" fill="#059669"/>
        </g>

        {/* Texto */}
        <text x="220" y="138" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="86" letterSpacing="-2">
          <tspan fill="#2563EB">W</tspan><tspan className={textColorClass}>commerce</tspan>
        </text>
      </svg>
      {showSubtitle && (
        <div className="flex flex-col items-center w-full mt-1">
          <span className="font-black uppercase text-brand-primary text-[8px] sm:text-[10px] tracking-[0.3em] leading-tight text-center">
            PLATAFORMA E-COMMERCE
          </span>
        </div>
      )}
    </div>
  );
};
