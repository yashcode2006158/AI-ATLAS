import React from 'react';
import { useEffect, useRef } from 'react';

const NodeCircle: React.FC<{
  x: number;
  y: number;
  color: string;
  size: number;
  floatPhase: number;
}> = ({ x, y, color, size, floatPhase }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf: number;
    let t = floatPhase;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.01;
      const dy = Math.sin(t) * 8;
      el.style.transform = `translateY(${dy}px)`;
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [floatPhase]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.7,
        boxShadow: `0 0 ${size * 3}px ${color}40`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

const nodes = [
  { x: 50, y: 30, color: '#5B8CFF', size: 10 },
  { x: 70, y: 40, color: '#A78BFA', size: 6 },
  { x: 30, y: 38, color: '#38BDF8', size: 7 },
  { x: 45, y: 22, color: '#5B8CFF', size: 5 },
  { x: 28, y: 28, color: '#7C3AED', size: 6 },
  { x: 65, y: 26, color: '#38BDF8', size: 4 },
  { x: 18, y: 32, color: '#A78BFA', size: 5 },
  { x: 48, y: 50, color: '#5B8CFF', size: 5 },
  { x: 60, y: 48, color: '#38BDF8', size: 4 },
  { x: 25, y: 52, color: '#A78BFA', size: 4 },
];

const connections: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 6],
  [1, 5], [2, 7], [3, 5], [4, 8], [6, 9],
  [7, 9], [8, 1], [5, 9], [2, 9],
];

export const HeroScene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {connections.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        return (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              left: `${na.x}%`,
              top: `${na.y}%`,
              width: `${Math.sqrt((nb.x - na.x) ** 2 + (nb.y - na.y) ** 2)}%`,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(91,140,255,0.15), rgba(91,140,255,0.05))',
              transform: `rotate(${Math.atan2(nb.y - na.y, nb.x - na.x) * (180 / Math.PI)}deg)`,
              transformOrigin: '0 0',
              animation: `flowPacket 4s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        );
      })}
      {nodes.map((node, i) => (
        <NodeCircle key={i} {...node} floatPhase={i * 0.7} />
      ))}
    </div>
  );
};
