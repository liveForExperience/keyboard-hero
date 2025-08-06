import React from 'react';
import { levelConfig } from '../utils/textData';

export default function LevelSelector({ level, onLevelChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {Object.entries(levelConfig).map(([value, config]) => (
        <button
          key={value}
          onClick={() => onLevelChange(value)}
          className={`px-6 py-3 rounded-2xl font-medium text-lg transition-all duration-200 hover:scale-105 ${
            level === value
              ? `bg-${config.color}-500 text-white shadow-lg`
              : `bg-white text-gray-700 border border-gray-200 hover:bg-${config.color}-50`
          }`}
          title={config.description}
        >
          {config.icon} {config.label}
        </button>
      ))}
    </div>
  );
}
