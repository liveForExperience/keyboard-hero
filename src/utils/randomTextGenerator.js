// 随机文本生成器

// 基础字符集
const CHARACTER_SETS = {
  // 英文字母
  letters: 'abcdefghijklmnopqrstuvwxyz',
  // 数字
  numbers: '0123456789',
  // 常用符号
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  // 空格
  space: ' ',
  // 常用英文单词
  commonWords: [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
  ],
  // 编程相关单词
  programmingWords: [
    'function', 'variable', 'array', 'object', 'string', 'number', 'boolean', 'null', 'undefined', 'class', 'method', 'property', 'parameter', 'argument', 'return', 'import', 'export', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'async', 'await', 'promise', 'callback'
  ],
  // 中文常用字符
  chineseChars: [
    '的', '一', '是', '在', '不', '了', '有', '和', '人', '这', '中', '大', '为', '上', '个', '国', '我', '以', '要', '他', '时', '来', '用', '们', '生', '到', '作', '地', '于', '出', '就', '分', '对', '成', '会', '可', '主', '发', '年', '动', '同', '工', '也', '能', '下', '过', '子', '说', '产', '种', '面', '而', '方', '后', '多', '定', '行', '学', '法', '所', '民', '得', '经', '十', '三', '之', '进', '着', '等', '部', '度', '家', '电', '力', '里', '如', '水', '化', '高', '自', '二', '理', '起', '小', '物', '现', '实', '加', '量', '都', '两', '体', '制', '机', '当', '使', '点', '从', '业', '本', '去', '把', '性', '好', '应', '开', '它', '合', '还', '因', '由', '其', '些', '然', '前', '外', '天', '政', '四', '日', '那', '社', '义', '事', '平', '形', '相', '全', '表', '间', '样', '与', '关', '各', '重', '新', 
  ]
};

// 随机文本生成模式
export const TEXT_GENERATION_MODES = {
  random_letters: {
    name: '随机字母',
    description: '纯随机英文字母组合',
    icon: '🔤'
  },
  random_words: {
    name: '随机单词',
    description: '常用英文单词组合',
    icon: '📝'
  },
  random_mixed: {
    name: '字母数字混合',
    description: '字母、数字和符号混合',
    icon: '🔢'
  },
  programming: {
    name: '编程词汇',
    description: '编程相关单词和符号',
    icon: '💻'
  },
  chinese_mixed: {
    name: '中英混合',
    description: '中文字符和英文混合',
    icon: '🌏'
  },
  nonsense: {
    name: '无意义文本',
    description: '完全随机的字符组合',
    icon: '🎲'
  }
};

// 字符数量预设选项
export const CHARACTER_COUNT_PRESETS = [
  { value: 50, label: '50字符 (短练习)' },
  { value: 100, label: '100字符 (标准)' },
  { value: 200, label: '200字符 (中等)' },
  { value: 300, label: '300字符 (长练习)' },
  { value: 500, label: '500字符 (挑战)' },
  { value: 1000, label: '1000字符 (极限)' }
];

/**
 * 生成随机字符
 * @param {string} charset - 字符集
 * @param {number} length - 长度
 * @returns {string} 随机字符串
 */
function generateRandomChars(charset, length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 生成随机单词序列
 * @param {Array} wordList - 单词列表
 * @param {number} targetLength - 目标长度
 * @returns {string} 单词序列
 */
function generateRandomWords(wordList, targetLength) {
  let result = '';
  let words = [];
  
  while (result.length < targetLength) {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    words.push(randomWord);
    
    // 计算当前长度（包括空格）
    const currentText = words.join(' ');
    if (currentText.length >= targetLength) {
      // 截取到目标长度
      result = currentText.substring(0, targetLength);
      break;
    }
    result = currentText;
  }
  
  return result;
}

/**
 * 生成混合内容
 * @param {Array} components - 组件配置
 * @param {number} targetLength - 目标长度
 * @returns {string} 混合内容
 */
function generateMixedContent(components, targetLength) {
  let result = '';
  let currentLength = 0;
  
  while (currentLength < targetLength) {
    // 随机选择一个组件
    const component = components[Math.floor(Math.random() * components.length)];
    
    if (component.type === 'chars') {
      // 生成1-5个字符
      const chunkLength = Math.min(
        Math.floor(Math.random() * 5) + 1,
        targetLength - currentLength
      );
      result += generateRandomChars(component.charset, chunkLength);
      currentLength += chunkLength;
    } else if (component.type === 'words') {
      // 添加一个单词
      const word = component.wordList[Math.floor(Math.random() * component.wordList.length)];
      if (currentLength + word.length <= targetLength) {
        result += word;
        currentLength += word.length;
        
        // 添加空格（如果还有空间）
        if (currentLength < targetLength) {
          result += ' ';
          currentLength += 1;
        }
      } else {
        // 如果单词太长，截取部分
        const remainingLength = targetLength - currentLength;
        result += word.substring(0, remainingLength);
        currentLength = targetLength;
      }
    } else if (component.type === 'space') {
      if (currentLength < targetLength && result[result.length - 1] !== ' ') {
        result += ' ';
        currentLength += 1;
      }
    }
  }
  
  return result.substring(0, targetLength);
}

/**
 * 主要的随机文本生成函数
 * @param {string} mode - 生成模式
 * @param {number} length - 目标长度
 * @returns {string} 生成的文本
 */
export function generateRandomText(mode, length) {
  if (length <= 0) return '';
  
  switch (mode) {
    case 'random_letters':
      return generateRandomChars(CHARACTER_SETS.letters, length);
    
    case 'random_words':
      return generateRandomWords(CHARACTER_SETS.commonWords, length);
    
    case 'random_mixed':
      return generateMixedContent([
        { type: 'chars', charset: CHARACTER_SETS.letters, weight: 0.6 },
        { type: 'chars', charset: CHARACTER_SETS.numbers, weight: 0.2 },
        { type: 'chars', charset: CHARACTER_SETS.symbols, weight: 0.1 },
        { type: 'space', weight: 0.1 }
      ], length);
    
    case 'programming':
      return generateMixedContent([
        { type: 'words', wordList: CHARACTER_SETS.programmingWords, weight: 0.5 },
        { type: 'chars', charset: CHARACTER_SETS.letters, weight: 0.2 },
        { type: 'chars', charset: CHARACTER_SETS.numbers, weight: 0.1 },
        { type: 'chars', charset: CHARACTER_SETS.symbols, weight: 0.1 },
        { type: 'space', weight: 0.1 }
      ], length);
    
    case 'chinese_mixed':
      return generateMixedContent([
        { type: 'words', wordList: CHARACTER_SETS.chineseChars, weight: 0.4 },
        { type: 'words', wordList: CHARACTER_SETS.commonWords, weight: 0.3 },
        { type: 'chars', charset: CHARACTER_SETS.letters, weight: 0.2 },
        { type: 'space', weight: 0.1 }
      ], length);
    
    case 'nonsense':
      // 完全无意义的随机字符
      const allChars = CHARACTER_SETS.letters + 
                      CHARACTER_SETS.numbers + 
                      CHARACTER_SETS.symbols + 
                      CHARACTER_SETS.space;
      return generateRandomChars(allChars, length);
    
    default:
      return generateRandomWords(CHARACTER_SETS.commonWords, length);
  }
}

/**
 * 生成指定难度的随机文本
 * @param {string} difficulty - 难度等级 (beginner, intermediate, advanced)
 * @param {number} length - 文本长度
 * @returns {string} 生成的文本
 */
export function generateTextByDifficulty(difficulty, length) {
  switch (difficulty) {
    case 'beginner':
      return generateRandomText('random_words', length);
    case 'intermediate':
      return generateRandomText('random_mixed', length);
    case 'advanced':
      return generateRandomText('programming', length);
    default:
      return generateRandomText('random_words', length);
  }
}

/**
 * 验证生成的文本质量
 * @param {string} text - 待验证的文本
 * @returns {Object} 验证结果
 */
export function validateGeneratedText(text) {
  const stats = {
    length: text.length,
    wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
    uniqueChars: new Set(text).size,
    hasNumbers: /\d/.test(text),
    hasSymbols: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(text),
    hasChinese: /[\u4e00-\u9fff]/.test(text),
    spaceRatio: (text.match(/\s/g) || []).length / text.length
  };
  
  return {
    isValid: stats.length > 0 && stats.uniqueChars >= 2,
    stats,
    quality: stats.uniqueChars >= 10 ? 'high' : stats.uniqueChars >= 5 ? 'medium' : 'low'
  };
}

/**
 * 获取推荐的字符数量
 * @param {string} difficulty - 难度等级
 * @param {number} userLevel - 用户水平 (1-10)
 * @returns {number} 推荐字符数
 */
export function getRecommendedLength(difficulty, userLevel = 5) {
  const baseLengths = {
    beginner: 80,
    intermediate: 150,
    advanced: 250
  };
  
  const baseLength = baseLengths[difficulty] || baseLengths.intermediate;
  const levelMultiplier = 0.8 + (userLevel / 10) * 0.4; // 0.8 - 1.2
  
  return Math.round(baseLength * levelMultiplier);
}

const randomTextGeneratorUtils = {
  generateRandomText,
  generateTextByDifficulty,
  validateGeneratedText,
  getRecommendedLength,
  TEXT_GENERATION_MODES,
  CHARACTER_COUNT_PRESETS
};

export default randomTextGeneratorUtils;
