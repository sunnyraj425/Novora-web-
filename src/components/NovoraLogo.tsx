import React from 'react';

export interface NovoraLogoProps {
  variant?: 'horizontal' | 'vertical' | 'emblem-only' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  theme?: 'gold' | 'cyan' | 'hybrid';
}

export const NovoraLogo: React.FC<NovoraLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
  theme = 'gold',
}) => {
  // Dimensions for standard responsive sizing
  const dimensions = {
    sm: { emblem: 34, height: 38, text: 'text-base', subText: 'text-[9px]' },
    md: { emblem: 44, height: 48, text: 'text-xl', subText: 'text-[10px]' },
    lg: { emblem: 64, height: 68, text: 'text-3xl', subText: 'text-xs' },
    xl: { emblem: 92, height: 96, text: 'text-5xl', subText: 'text-sm' },
  }[size];

  // Gradients based on theme
  const isCyan = theme === 'cyan';
  const isGold = theme === 'gold' || theme === 'hybrid';

  // Primary metallic tone
  const primaryStroke = isCyan ? '#38BDF8' : '#F5D76E';
  const secondaryStroke = isCyan ? '#0284C7' : '#D4AF37';
  const highlightStroke = isCyan ? '#E0F2FE' : '#FFF3C4';
  const deepShadow = isCyan ? '#075985' : '#8C6D1F';

  // The official Cyber-Hexagon Emblem with 3D Monogram "N" & Pixel Dispersion
  const Emblem = (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 select-none"
      style={{
        width: dimensions.emblem,
        height: dimensions.emblem,
      }}
    >
      {/* Ambient Outer Aura */}
      <div 
        className="absolute inset-0 rounded-full blur-md -z-10 opacity-40 group-hover:opacity-75 transition-opacity duration-500"
        style={{
          background: isCyan 
            ? 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(212,175,55,0.35) 0%, transparent 70%)'
        }}
      />

      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
      >
        <defs>
          {/* Main Hexagon Linear Gradient */}
          <linearGradient id={`hexGrad-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={highlightStroke} />
            <stop offset="25%" stopColor={primaryStroke} />
            <stop offset="60%" stopColor={secondaryStroke} />
            <stop offset="100%" stopColor={deepShadow} />
          </linearGradient>

          {/* Inner Hex Contour Gradient */}
          <linearGradient id={`hexInner-${size}-${theme}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={highlightStroke} />
            <stop offset="45%" stopColor={primaryStroke} />
            <stop offset="85%" stopColor={secondaryStroke} />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>

          {/* 3D N Monogram Left Leg */}
          <linearGradient id={`nLeftLeg-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor={primaryStroke} />
            <stop offset="80%" stopColor={secondaryStroke} />
            <stop offset="100%" stopColor={deepShadow} />
          </linearGradient>

          {/* 3D N Monogram Crossbar Face */}
          <linearGradient id={`nCrossbar-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor={highlightStroke} />
            <stop offset="60%" stopColor={primaryStroke} />
            <stop offset="90%" stopColor={deepShadow} />
          </linearGradient>

          {/* 3D N Monogram Bevel Shadow */}
          <linearGradient id={`nShadow-${size}-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secondaryStroke} />
            <stop offset="50%" stopColor={deepShadow} />
            <stop offset="100%" stopColor="#0B0904" />
          </linearGradient>

          {/* Pixel Cube Particle Gradients */}
          <linearGradient id={`pxGrad1-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={primaryStroke} />
          </linearGradient>
          <linearGradient id={`pxGrad2-${size}-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryStroke} />
            <stop offset="100%" stopColor={secondaryStroke} />
          </linearGradient>
        </defs>

        {/* 1. DISPERSING DIGITAL PIXEL DATA CUBES (TOP RIGHT) */}
        <g id="pixel-dispersion">
          {/* Outer floating pixels */}
          <rect x="246" y="74" width="7" height="7" rx="1" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.95" />
          <rect x="264" y="84" width="6" height="6" rx="1" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.9" />
          <rect x="232" y="90" width="8" height="8" rx="1.5" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.85" />
          <rect x="248" y="94" width="10" height="10" rx="1.5" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.95" />
          <rect x="268" y="98" width="6" height="6" rx="1" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.8" />
          <rect x="228" y="106" width="8" height="8" rx="1" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.85" />

          {/* Core swarm around the top-right vertex */}
          <rect x="210" y="85" width="9" height="9" rx="1.5" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.9" />
          <rect x="222" y="78" width="7" height="7" rx="1" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.95" />
          <rect x="198" y="98" width="11" height="11" rx="1.5" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.95" />
          <rect x="212" y="100" width="13" height="13" rx="2" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.95" />
          <rect x="230" y="120" width="10" height="10" rx="1.5" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.9" />
          <rect x="245" y="112" width="8" height="8" rx="1.5" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.85" />

          {/* Right edge dispersion cascade */}
          <rect x="202" y="118" width="10" height="10" rx="1.5" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.9" />
          <rect x="216" y="126" width="9" height="9" rx="1.5" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.95" />
          <rect x="208" y="142" width="8" height="8" rx="1" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.85" />
          <rect x="226" y="138" width="11" height="11" rx="1.5" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.9" />
          <rect x="240" y="142" width="6" height="6" rx="1" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.8" />
          <rect x="222" y="156" width="8" height="8" rx="1" fill={`url(#pxGrad1-${size}-${theme})`} opacity="0.9" />
          <rect x="234" y="165" width="6" height="6" rx="1" fill={`url(#pxGrad2-${size}-${theme})`} opacity="0.85" />
        </g>

        {/* 2. CYBER GEOMETRIC HEXAGON FRAME */}
        {/* Outer Hexagon Contour */}
        <path
          d="M 160,54 L 236,98 L 236,206 L 160,250 L 84,206 L 84,98 Z"
          fill="none"
          stroke={`url(#hexGrad-${size}-${theme})`}
          strokeWidth="7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Inner Parallel Bevel Track */}
        <path
          d="M 160,68 L 224,105 L 224,199 L 160,236 L 96,199 L 96,105 Z"
          fill="none"
          stroke={`url(#hexInner-${size}-${theme})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Fine secondary outline facet */}
        <path
          d="M 152,48 L 76,92 L 76,212 L 160,260 L 244,212"
          fill="none"
          stroke={highlightStroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* 3. DIMENSIONAL 3D MONOGRAM "N" */}
        {/* Left Vertical Leg */}
        <path
          d="M 116,102 L 140,102 L 140,214 L 116,214 Z"
          fill={`url(#nLeftLeg-${size}-${theme})`}
        />

        {/* Left Bottom Bevel Notch */}
        <polygon
          points="116,214 140,214 121,226 104,217"
          fill={`url(#nShadow-${size}-${theme})`}
        />

        {/* 3D Diagonal Under-Extrusion Shadow */}
        <polygon
          points="116,102 140,102 204,214 180,214"
          fill={`url(#nShadow-${size}-${theme})`}
          opacity="0.95"
        />

        {/* Main 3D Diagonal Crossbar Face */}
        <polygon
          points="116,102 148,102 204,198 180,198"
          fill={`url(#nCrossbar-${size}-${theme})`}
        />

        {/* Specular White Rim Highlight on Diagonal */}
        <line
          x1="116" y1="102"
          x2="204" y2="198"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Right Vertical Leg */}
        <path
          d="M 180,102 L 204,102 L 204,214 L 180,214 Z"
          fill={`url(#nLeftLeg-${size}-${theme})`}
        />

        {/* Right Leg Top Edge Highlight */}
        <line
          x1="180" y1="102"
          x2="204" y2="102"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  // Typography portion: "NOVORA" with "— DIGITAL —"
  const Logotype = (
    <div className="flex flex-col justify-center select-none text-left">
      {/* Brand Title: NOVORA */}
      <span
        className={`font-sans font-black tracking-[0.24em] uppercase leading-none ${dimensions.text} bg-gradient-to-r ${
          isCyan
            ? 'from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8]'
            : 'from-[#FFF8D9] via-[#F5D76E] to-[#D4AF37]'
        } bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}
      >
        NOVORA
      </span>

      {/* Subtitle & Rules: — DIGITAL — */}
      {showTagline && (
        <div className="flex items-center gap-2 mt-1">
          <span 
            className="h-[1px] w-4 rounded-full"
            style={{
              background: isCyan
                ? 'linear-gradient(90deg, transparent, #38BDF8)'
                : 'linear-gradient(90deg, transparent, #D4AF37)'
            }}
          />
          <span
            className={`font-sans font-semibold tracking-[0.38em] uppercase leading-none ${dimensions.subText} ${
              isCyan ? 'text-[#7DD3FC]' : 'text-[#E5C358]'
            }`}
          >
            DIGITAL
          </span>
          <span 
            className="h-[1px] w-4 rounded-full"
            style={{
              background: isCyan
                ? 'linear-gradient(90deg, #38BDF8, transparent)'
                : 'linear-gradient(90deg, #D4AF37, transparent)'
            }}
          />
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // LAYOUT VARIANTS
  // -------------------------------------------------------------

  // 1. EMBLEM ONLY (for avatars, watermarks, stamps)
  if (variant === 'emblem-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{Emblem}</div>;
  }

  // 2. VERTICAL / STACKED (for Login, Hero, SplashScreen)
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center justify-center text-center group cursor-pointer ${className}`}>
        {Emblem}
        <div className="mt-3 flex flex-col items-center">
          <span
            className={`font-sans font-black tracking-[0.28em] uppercase leading-none ${dimensions.text} bg-gradient-to-r ${
              isCyan
                ? 'from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8]'
                : 'from-[#FFF8D9] via-[#F5D76E] to-[#D4AF37]'
            } bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
          >
            NOVORA
          </span>
          {showTagline && (
            <div className="flex items-center justify-center gap-2 mt-1.5 w-full">
              <span 
                className="h-[1px] flex-1 max-w-[28px] rounded-full"
                style={{
                  background: isCyan
                    ? 'linear-gradient(90deg, transparent, #38BDF8)'
                    : 'linear-gradient(90deg, transparent, #D4AF37)'
                }}
              />
              <span
                className={`font-sans font-semibold tracking-[0.38em] uppercase leading-none ${dimensions.subText} ${
                  isCyan ? 'text-[#7DD3FC]' : 'text-[#E5C358]'
                }`}
              >
                DIGITAL
              </span>
              <span 
                className="h-[1px] flex-1 max-w-[28px] rounded-full"
                style={{
                  background: isCyan
                    ? 'linear-gradient(90deg, #38BDF8, transparent)'
                    : 'linear-gradient(90deg, #D4AF37, transparent)'
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. COMPACT (for checkout headers, tight spaces)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 group select-none ${className}`}>
        {Emblem}
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-sans font-extrabold tracking-[0.22em] uppercase leading-none text-base bg-gradient-to-r ${
              isCyan
                ? 'from-[#FFFFFF] to-[#38BDF8]'
                : 'from-[#FFF8D9] to-[#D4AF37]'
            } bg-clip-text text-transparent`}
          >
            NOVORA
          </span>
          <span
            className={`text-[9px] font-mono tracking-[0.2em] uppercase ${
              isCyan ? 'text-[#38BDF8]' : 'text-[#D4AF37]'
            }`}
          >
            DIGITAL
          </span>
        </div>
      </div>
    );
  }

  // 4. HORIZONTAL (DEFAULT - for Navbar, Footer, Admin Dashboard)
  return (
    <div className={`inline-flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {Emblem}
      {Logotype}
    </div>
  );
};
