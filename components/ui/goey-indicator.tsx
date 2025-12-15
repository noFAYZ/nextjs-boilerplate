import { useId } from "react";

export const GooeyIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const id = useId();
  const dots = Array.from({ length: total });
  const spacing = 32;
  const baseRadius = 8;
  const activeRadius = 12;

  const safeCurrent = Math.min(Math.max(current, 0), total - 1);
  const width = spacing * (total - 1) + 40;

  return (
    <svg
      width={width}
      height={50}
      viewBox={`0 0 ${width} 50`}
      className="z-20"
    >
      <defs>
        <filter id={`gooey-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -7
            "
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>

      <g filter={`url(#gooey-${id})`}>
        {/* Connectors */}
        {dots.slice(0, -1).map((_, i) => {
          const x1 = 10 + i * spacing;
          const x2 = x1 + spacing;

          return (
            <rect
              key={i}
              x={x1}
              y={22}
              width={spacing}
              height={8}
              rx={3}
              fill="#fff"
            />
          );
        })}

        {/* Dots */}
        {dots.map((_, i) => {
          const isActive = i === safeCurrent;
          const x = 20 + i * spacing;

          return (
            <circle
              key={i}
              cx={x}
              cy={26}
              r={isActive ? activeRadius : baseRadius}
              fill="#fff"
              style={{
                transition:
                  "r 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};
