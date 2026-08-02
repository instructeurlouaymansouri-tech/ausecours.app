'use client';

import { useEffect, useRef } from 'react';

/** A continuously scrolling, glowing red ECG line — the site's signature ICU-monitor motif. */
export default function EcgLine({ height = 90 }: { height?: number }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    let d = 'M0,45 ';
    const beat = (x0: number) =>
      `L${x0},45 L${x0 + 20},45 L${x0 + 28},20 L${x0 + 36},70 L${x0 + 44},10 L${x0 + 52},60 L${x0 + 60},45 L${x0 + 95},45 `;
    for (let x = 0; x < 1300; x += 95) d += beat(x);
    path.setAttribute('d', d);

    const len = path.getTotalLength ? path.getTotalLength() : 3000;
    path.style.strokeDasharray = `${len * 0.14} ${len}`;

    let offset = 0;
    let raf: number;
    const animate = () => {
      offset -= 6;
      if (Math.abs(offset) > len) offset = 0;
      path.style.strokeDashoffset = String(offset);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative mx-auto max-w-[1100px]" style={{ height }}>
      <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="block h-full w-full">
        <defs>
          <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF2D2D" stopOpacity="0" />
            <stop offset="15%" stopColor="#FF2D2D" stopOpacity="1" />
            <stop offset="85%" stopColor="#FF2D2D" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF2D2D" stopOpacity="0" />
          </linearGradient>
          <filter id="ecgGlow">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          d=""
          fill="none"
          stroke="url(#ecgGrad)"
          strokeWidth={2.4}
          filter="url(#ecgGlow)"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
