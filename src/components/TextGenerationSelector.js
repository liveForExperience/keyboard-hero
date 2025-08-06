import React, { useState } from 'react';
import { TEXT_GENERATION_MODES, CHARACTER_COUNT_PRESETS } from '../utils/randomTextGenerator';

export default function TextGenerationSelector({ 
  onGenerateText, 
  currentMode = 'random_words', 
  currentLength = 100,
  isGenerating = false 
}) {
  const [selectedMode, setSelectedMode] = useState(currentMode);
  const [selectedLength, setSelectedLength] = useState(currentLength);
  const [customLength, setCustomLength] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const handleLengthChange = (length) => {
    setSelectedLength(length);
    setShowCustomInput(false);
    setCustomLength('');
  };

  const handleCustomLengthSubmit = () => {
    const length = parseInt(customLength);
    if (length && length > 0 && length <= 2000) {
      setSelectedLength(length);
      setShowCustomInput(false);
      setCustomLength('');
    }
  };

  const handleGenerate = () => {
    onGenerateText(selectedMode, selectedLength);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🎲 随机文本生成器</h3>
        <p className="text-gray-600 text-sm">选择生成模式和字符数量，创建个性化的打字练习内容</p>
      </div>

      {/* 文本生成模式选择 */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">生成模式</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(TEXT_GENERATION_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedMode === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="font-medium text-sm">{mode.name}</div>
              <div className="text-xs opacity-75 mt-1">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 字符数量选择 */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">字符数量</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          {CHARACTER_COUNT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleLengthChange(preset.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedLength === preset.value && !showCustomInput
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              <div className="font-medium text-sm">{preset.label}</div>
            </button>
          ))}
        </div>

        {/* 自定义长度输入 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              showCustomInput
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
            }`}
          >
            ⚙️ 自定义长度
          </button>
          
          {showCustomInput && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customLength}
                onChange={(e) => setCustomLength(e.target.value)}
                placeholder="输入字符数"
                min="1"
                max="2000"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCustomLengthSubmit}
                disabled={!customLength || parseInt(customLength) <= 0}
                className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确定
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 当前配置显示 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <strong>模式:</strong> {TEXT_GENERATION_MODES[selectedMode]?.icon} {TEXT_GENERATION_MODES[selectedMode]?.name}
            </span>
            <span className="text-gray-600">
              <strong>长度:</strong> {selectedLength} 字符
            </span>
          </div>
          <div className="text-xs text-gray-500">
            预计用时: ~{Math.round(selectedLength / 5)} 秒
          </div>
        </div>
      </div>

      {/* 生成按钮 */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <span>🎯</span>
              <span>生成随机文本</span>
            </>
          )}
        </button>
      </div>

      {/* 使用提示 */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 space-y-1">
          <div>💡 提示: 不同模式适合不同的练习目标</div>
          <div>🎯 建议: 初学者选择"随机单词"，进阶者尝试"编程词汇"</div>
        </div>
      </div>
    </div>
  );
}
