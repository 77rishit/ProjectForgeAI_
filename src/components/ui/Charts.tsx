import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 1. Responsive Area Chart / Sparkline
// ==========================================
export interface AreaChartPoint {
  label: string;
  value: number;
}

export interface AreaChartProps {
  data: AreaChartPoint[];
  height?: number;
  color?: string;
  gradientId?: string;
  showPoints?: boolean;
  className?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 180,
  color = '#6366f1',
  gradientId = 'area-chart-grad',
  showPoints = true,
  className = ''
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const paddingX = 30;
  const paddingY = 24;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.value - minValue) / range) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = height - paddingY - ratio * (height - 2 * paddingY);
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Gradient fill */}
        <motion.path
          d={areaD}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Stroke line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Points and hover interaction */}
        {showPoints &&
          points.map((p, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 6 : 4}
                fill={hoveredIdx === idx ? '#ffffff' : color}
                stroke="#090a10"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>
          ))}
      </svg>

      {/* Hover Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute -top-1 pointer-events-none transform -translate-x-1/2 p-2 rounded-xl border border-white/10 bg-[#0e1224]/95 backdrop-blur-xl shadow-xl text-center"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`
          }}
        >
          <div className="text-[10px] text-white/50">{points[hoveredIdx].label}</div>
          <div className="text-xs font-bold text-white">{points[hoveredIdx].value}</div>
        </div>
      )}

      {/* X-axis labels */}
      <div className="flex justify-between px-4 pt-2 text-[10px] text-white/40">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
};

// ==========================================
// 2. Responsive Bar Chart
// ==========================================
export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 180, className = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-end justify-between gap-2 sm:gap-3" style={{ height }}>
        {data.map((item, idx) => {
          const heightPercent = Math.max(8, (item.value / maxValue) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && (
                <div className="absolute -top-8 px-2 py-1 rounded-md bg-[#0e1224] border border-white/15 text-[10px] font-bold text-white shadow-xl z-20 whitespace-nowrap">
                  {item.value}
                </div>
              )}

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className={`w-full max-w-[48px] rounded-t-xl transition-all duration-200 ${
                  isHovered ? 'brightness-125 shadow-lg shadow-indigo-500/30' : 'opacity-90'
                }`}
                style={{
                  background: item.color || 'linear-gradient(180deg, #6366f1 0%, #4338ca 100%)'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center truncate text-[10px] text-white/50 px-0.5">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. Responsive Donut Chart
// ==========================================
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  centerValue?: string | number;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 160,
  strokeWidth = 14,
  centerText,
  centerValue,
  className = ''
}) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 ${className}`}>
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((seg, idx) => {
            const percent = seg.value / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            return (
              <motion.circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {centerValue && (
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">{centerValue}</span>
          )}
          {centerText && <span className="text-[10px] text-white/50 uppercase tracking-wider">{centerText}</span>}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 w-full max-w-xs">
        {data.map((seg, idx) => {
          const percent = Math.round((seg.value / total) * 100);
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-white/70 truncate">{seg.label}</span>
              </div>
              <span className="font-bold text-white font-mono ml-2">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
