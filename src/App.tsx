import React from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import ThemeToggle from './components/ThemeToggle';
import SelfMapVisualization from './components/SelfMapVisualization';

const sampleData = {
  "Creative Expression": {
    "Strength": 8,
    "Title": "Creative Lead",
    "Beliefs": "Creativity drives innovation",
    "Style": "Experimental approach"
  },
  "Technical Mastery": {
    "Strength": 6,
    "Title": "Technical Expert",
    "Beliefs": "Continuous learning is key",
    "Style": "Analytical mindset"
  },
  "Community Building": {
    "Strength": 9,
    "Title": "Community Manager",
    "Beliefs": "Strong communities create value",
    "Style": "Inclusive leadership"
  },
  "Personal Growth": {
    "Strength": 7,
    "Title": "Growth Advocate",
    "Beliefs": "Always evolving",
    "Style": "Reflective practice"
  },
  "Leadership": {
    "Strength": 5,
    "Title": "Emerging Leader",
    "Beliefs": "Lead by example",
    "Style": "Collaborative approach"
  }
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'dark bg-dark-bg text-dark-text' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Self Map Visualization</h1>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <SelfMapVisualization data={sampleData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;