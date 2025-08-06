export const calculateWPM = (startTime, endTime, textLength) => {
  if (!endTime || !startTime) return 0;
  const timeInMinutes = (endTime - startTime) / 1000 / 60;
  const wordsTyped = textLength / 5; // 标准WPM计算：每5个字符算一个词
  return Math.round(wordsTyped / timeInMinutes);
};

export const calculateAccuracy = (textLength, errors) => {
  if (textLength === 0) return 100;
  return Math.round(((textLength - errors) / textLength) * 100);
};

export const getProgressPercentage = (userInputLength, textLength) => {
  return (userInputLength / textLength) * 100;
};

export const getPerformanceLevel = (wpm, accuracy) => {
  if (accuracy < 80) return { level: '需要提高', color: 'red', icon: '📈' };
  if (accuracy >= 95 && wpm >= 60) return { level: '优秀', color: 'green', icon: '🏆' };
  if (accuracy >= 90 && wpm >= 40) return { level: '良好', color: 'blue', icon: '👍' };
  if (accuracy >= 85) return { level: '一般', color: 'yellow', icon: '⭐' };
  return { level: '需要练习', color: 'orange', icon: '💪' };
};
