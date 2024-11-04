import React from 'react';
import { Info } from 'lucide-react';

interface InfoPanelProps {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ showInfo, setShowInfo }) => {
  return (
    <>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Info size={20} />
      </button>

      {showInfo && (
        <div className="absolute top-14 right-4 w-64 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-10 text-sm">
          <h3 className="font-bold mb-2">How to Use</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Hover over points to see details</li>
            <li>• Click points to explore sub-categories</li>
            <li>• Points size indicates strength</li>
            <li>• Lines show relationships</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default InfoPanel;