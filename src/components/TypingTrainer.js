import React, { useState, useEffect, useRef, useCallback } from 'react';
import StatsCard from './StatsCard';
import TextDisplay from './TextDisplay';
import LevelSelector from './LevelSelector';
import ResultModal from './ResultModal';
import TextGenerationSelector from './TextGenerationSelector';
import { practiceTexts } from '../utils/textData';
import { generateRandomText } from '../utils/randomTextGenerator';
import { calculateWPM, calculateAccuracy, getProgressPercentage } from '../utils/calculations';

export default function TypingTrainer() {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [level, setLevel] = useState('beginner');
  const [showStats, setShowStats] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [bestWPM, setBestWPM] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [useRandomText, setUseRandomText] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [randomTextMode, setRandomTextMode] = useState('random_words');
  const [textLength, setTextLength] = useState(100);
  
  const inputRef = useRef(null);

  // 清理会话数据
  const clearSession = useCallback(() => {
    localStorage.removeItem('typingSession');
    console.log('🗑️ 已清理练习会话');
  }, []);

  const resetTest = useCallback(() => {
    // 清理之前的会话
    clearSession();
    
    if (useRandomText) {
      // 使用随机文本生成
      const randomText = generateRandomText(randomTextMode, textLength);
      setCurrentText(randomText);
    } else {
      // 使用预设文本
      const texts = practiceTexts[level];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setCurrentText(randomText);
    }
    setUserInput('');
    setIsStarted(false);
    setIsCompleted(false);
    setErrors(0);
    setStartTime(0);
    setEndTime(0);
  }, [level, useRandomText, randomTextMode, textLength, clearSession]);

  // 从localStorage加载数据
  useEffect(() => {
    // 加载统计数据
    const savedStats = localStorage.getItem('typingStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setBestWPM(stats.bestWPM || 0);
      setStreak(stats.streak || 0);
      setTotalTests(stats.totalTests || 0);
    }
    
    // 尝试恢复未完成的练习会话
    const savedSession = localStorage.getItem('typingSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      // 检查会话是否仍然有效（24小时内）
      const sessionAge = Date.now() - session.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24小时
      
      if (sessionAge < maxAge && !session.isCompleted) {
        // 恢复会话状态
        setCurrentText(session.currentText);
        setUserInput(session.userInput);
        setLevel(session.level);
        setUseRandomText(session.useRandomText);
        setRandomTextMode(session.randomTextMode || 'random_words');
        setTextLength(session.textLength || 100);
        setErrors(session.errors || 0);
        setIsStarted(session.isStarted);
        setStartTime(session.startTime || 0);
        
        console.log('🔄 已恢复未完成的练习会话');
        return; // 不执行resetTest
      } else {
        // 清理过期或已完成的会话
        localStorage.removeItem('typingSession');
      }
    }
    
    resetTest();
  }, [level, resetTest]);

  const startTest = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isStarted) {
      startTest();
    }

    if (value.length > currentText.length) {
      return;
    }

    setUserInput(value);

    let newErrors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        newErrors++;
      }
    }
    setErrors(newErrors);

    // 保存当前会话状态到localStorage
    saveCurrentSession(value, newErrors, true);

    if (value === currentText) {
      completeTest();
    }
  };

  const completeTest = () => {
    const endTime = Date.now();
    setIsCompleted(true);
    setIsStarted(false);
    setEndTime(endTime);
    
    const wpm = calculateWPM(startTime, endTime, currentText.length);
    const accuracy = calculateAccuracy(currentText.length, errors);
    
    // 更新统计
    setTotalTests(prev => prev + 1);
    if (wpm > bestWPM) {
      setBestWPM(wpm);
    }
    
    if (accuracy > 95) {
      setStreak(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setStreak(0);
    }

    // 保存到localStorage（实际项目中）
    localStorage.setItem('typingStats', JSON.stringify({
      bestWPM: Math.max(bestWPM, wpm),
      streak: accuracy > 95 ? streak + 1 : 0,
      totalTests: totalTests + 1
    }));
    
    // 标记会话为已完成并清理
    const sessionData = {
      isCompleted: true,
      completedAt: Date.now()
    };
    localStorage.setItem('typingSession', JSON.stringify(sessionData));
    
    // 延迟清理会话数据
    setTimeout(() => {
      localStorage.removeItem('typingSession');
    }, 5000); // 5秒后清理
    
    setShowStats(true);
  };

  // 保存当前会话状态到localStorage
  const saveCurrentSession = useCallback((currentInput, currentErrors, isActive) => {
    if (!currentText || currentText.length === 0) return;
    
    const sessionData = {
      currentText,
      userInput: currentInput,
      level,
      useRandomText,
      randomTextMode,
      textLength,
      errors: currentErrors,
      isStarted: isActive,
      startTime,
      isCompleted: false,
      timestamp: Date.now()
    };
    
    localStorage.setItem('typingSession', JSON.stringify(sessionData));
  }, [currentText, level, useRandomText, randomTextMode, textLength, startTime]);

  // 处理随机文本生成
  const handleGenerateRandomText = useCallback((mode, length) => {
    setIsGeneratingText(true);
    
    // 模拟生成延迟（增加用户体验）
    setTimeout(() => {
      const randomText = generateRandomText(mode, length);
      setCurrentText(randomText);
      setRandomTextMode(mode);
      setTextLength(length);
      setUserInput('');
      setIsStarted(false);
      setIsCompleted(false);
      setErrors(0);
      setStartTime(0);
      setEndTime(0);
      setIsGeneratingText(false);
    }, 300);
  }, []);

  // 切换文本模式
  const toggleTextMode = () => {
    setUseRandomText(!useRandomText);
    // 切换模式后重置测试
    setTimeout(() => {
      if (!useRandomText) {
        // 切换到随机文本模式，生成默认文本
        handleGenerateRandomText(randomTextMode, textLength);
      } else {
        // 切换到预设文本模式
        resetTest();
      }
    }, 100);
  };

  const currentAccuracy = calculateAccuracy(currentText.length, errors);
  const progress = getProgressPercentage(userInput.length, currentText.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {showCelebration && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-6xl animate-bounce">
          🎉
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            ⌨️ 打字训练器
          </h1>
          <p className="text-xl text-gray-600">
            提升你的打字技能，成为键盘高手！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard icon="⚡" value={bestWPM} label="最佳速度 (WPM)" />
          <StatsCard icon="🎯" value={`${currentAccuracy}%`} label="准确率" />
          <StatsCard icon="🏆" value={streak} label="连胜记录" />
        </div>

        {/* 文本模式切换 */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">文本模式:</span>
              <button
                onClick={toggleTextMode}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !useRandomText
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📚 预设文本
              </button>
              <button
                onClick={toggleTextMode}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  useRandomText
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🎲 随机生成
              </button>
            </div>
          </div>
        </div>

        {/* 根据模式显示不同的选择器 */}
        {!useRandomText ? (
          <LevelSelector level={level} onLevelChange={setLevel} />
        ) : (
          <TextGenerationSelector
            onGenerateText={handleGenerateRandomText}
            currentMode={randomTextMode}
            currentLength={textLength}
            isGenerating={isGeneratingText}
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="h-2 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <TextDisplay currentText={currentText} userInput={userInput} />

          <div className="p-6">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={isCompleted}
              placeholder={isStarted ? '' : '点击开始打字...'}
              className="w-full h-20 border-2 border-gray-200 rounded-xl p-4 text-lg font-mono outline-none resize-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-center gap-4 p-6 pt-0">
            {!isStarted && !isCompleted && (
              <button
                onClick={startTest}
                disabled={isGeneratingText}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingText ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    ▶️ 开始练习
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={resetTest}
              disabled={isGeneratingText}
              className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-medium text-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 重新开始
            </button>
            
            {useRandomText && (
              <button
                onClick={() => handleGenerateRandomText(randomTextMode, textLength)}
                disabled={isGeneratingText || isStarted}
                className="px-8 py-3 border-2 border-green-500 text-green-500 rounded-xl font-medium text-lg hover:bg-green-50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎲 重新生成
              </button>
            )}
          </div>
        </div>

        {isStarted && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(((Date.now() - startTime) / 1000))}s
                </div>
                <div className="text-sm text-gray-500">用时</div>
              </div>
              <div>
                <div className={`text-3xl font-bold ${errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {errors}
                </div>
                <div className="text-sm text-gray-500">错误</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {userInput.length}/{currentText.length}
                </div>
                <div className="text-sm text-gray-500">进度</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResultModal
        show={showStats}
        onClose={() => setShowStats(false)}
        wpm={calculateWPM(startTime, endTime, currentText.length)}
        accuracy={currentAccuracy}
        time={Math.round((endTime - startTime) / 1000)}
      />
    </div>
  );
}
