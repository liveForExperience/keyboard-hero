import React from 'react';
import { getPerformanceLevel } from '../utils/calculations';

export default function ResultModal({ show, onClose, wpm, accuracy, time }) {
  if (!show) return null;
  
  const performance = getPerformanceLevel(wpm, accuracy);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{accuracy === 100 ? '🏆' : '🎉'}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {accuracy === 100 ? '完美！太棒了！' : '练习完成！'}
          </h3>
          <p className="text-gray-600">
            {accuracy === 100 ? '你就是 Keyboard Hero！🎯' : '你的成绩'}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{wpm}</div>
            <div className="text-xs text-gray-500">WPM</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-xs text-gray-500">准确率</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600">{time}s</div>
            <div className="text-xs text-gray-500">时间</div>
          </div>
        </div>
        
        <div className={`bg-${performance.color}-100 border border-${performance.color}-300 rounded-xl p-3 mb-6 text-center`}>
          <span className={`text-${performance.color}-700 font-medium`}>
            {performance.icon} {performance.level}
          </span>
        </div>
        
        {accuracy === 100 && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-xl p-4 mb-6 text-center animate-pulse">
            <div className="text-2xl mb-2">🌟</div>
            <span className="text-yellow-800 font-bold text-lg">完美表现！零错误完成！</span>
            <div className="text-yellow-700 text-sm mt-1">你已经达到了 Keyboard Hero 的水准！</div>
          </div>
        )}
        
        {accuracy > 95 && accuracy < 100 && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-3 mb-6 text-center">
            <span className="text-yellow-700 font-medium">⭐ 优秀表现！准确率超过95%</span>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          继续练习
        </button>
      </div>
    </div>
  );
}
