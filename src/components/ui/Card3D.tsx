import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Card3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltStrength?: number;
}> = ({ children, className = '', onClick, tiltStrength = 8 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setRotateY(((x - centerX) / centerX) * tiltStrength);
      setRotateX(((centerY - y) / centerY) * tiltStrength);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    const el = ref.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [tiltStrength]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`card-3d ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};
