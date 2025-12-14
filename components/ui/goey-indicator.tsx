import React from 'react';

const GooeyDotIndicator = ({ current = 1, total = 5 }) => {
  const baseRadius = 10;
  const activeRadius = 16;
  const dotSpacing = 48;
  const width = Math.max(200, (total - 1) * dotSpacing + 80);
  const height = 80;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Image ${current} of ${total}`}
    >
      <defs>
        <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>

      <g filter="url(#goo)">
        {Array.from({ length: total }, (_, i) => {
          const index = i + 1;
          const isActive = index === current;
          const cx = width / 2 + (i - (total - 1) / 2) * dotSpacing;
          const cy = height / 2;
          const r = isActive ? activeRadius : baseRadius;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="#6366f1" // indigo-500, change to any color you like
              style={{
                transition: 'r 0.4s ease, cx 0.4s ease',
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default GooeyDotIndicator;