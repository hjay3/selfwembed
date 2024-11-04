import React from 'react';
import { ProcessedDataPoint } from './types';

interface TooltipProps {
  data: ProcessedDataPoint;
  colorScale: (name: string) => string;
}

const ChartTooltip: React.FC<TooltipProps> = ({ data, colorScale }) => {
  return (
    <div className="space-y-2">
      <div className="font-bold text-lg">{data.name}</div>
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ background: colorScale(data.name) }}
        />
        <div>Strength: {data.strength}/10</div>
      </div>
      {data.details.Title && (
        <div className="text-gray-300">Role: {data.details.Title}</div>
      )}
      {data.details.Beliefs && (
        <div className="text-gray-300">Beliefs: {data.details.Beliefs}</div>
      )}
      {data.details.Style && (
        <div className="text-gray-300">Style: {data.details.Style}</div>
      )}
    </div>
  );
};

export default ChartTooltip;