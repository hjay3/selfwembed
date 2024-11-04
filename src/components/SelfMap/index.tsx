import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { D3Chart } from './D3Chart';
import { IdentityData } from './types';
import { generateRelatedData } from './data';
import InfoPanel from './InfoPanel';

interface SelfMapProps {
  data: Record<string, IdentityData>;
}

const SelfMap: React.FC<SelfMapProps> = ({ data }) => {
  const primaryChartRef = useRef<HTMLDivElement>(null);
  const secondaryChartRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (primaryChartRef.current) {
      const dimensions = {
        width: 900,
        height: 700,
        margin: { top: 60, right: 160, bottom: 60, left: 60 }
      };

      const chart = new D3Chart(primaryChartRef.current, dimensions);
      chart.updateData(data, (category) => {
        setSelectedCategory(category);
        const relatedData = generateRelatedData(category);
        
        if (secondaryChartRef.current) {
          const secondaryDimensions = {
            width: 800,
            height: 600,
            margin: { top: 60, right: 160, bottom: 60, left: 60 }
          };
          
          setTimeout(() => {
            const secondaryChart = new D3Chart(
              secondaryChartRef.current!, 
              secondaryDimensions, 
              true
            );
            secondaryChart.updateData(relatedData[Object.keys(relatedData)[0]]);
          }, 100);
        }
      });
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-white rounded-lg shadow-lg p-6">
        <InfoPanel showInfo={showInfo} setShowInfo={setShowInfo} />
        <div ref={primaryChartRef} className="w-full" style={{ minHeight: '700px' }} />
      </div>

      {selectedCategory && (
        <div className="relative w-full bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Overview
            </button>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
          <div ref={secondaryChartRef} className="w-full" style={{ minHeight: '600px' }} />
        </div>
      )}
    </div>
  );
};

export default SelfMap;