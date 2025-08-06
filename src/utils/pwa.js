// PWA 工具函数集合

/**
 * 检查PWA安装状态
 */
export const checkPWAInstallStatus = () => {
  // 检查是否在独立模式下运行
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone ||
                      document.referrer.includes('android-app://');
  
  // 检查是否支持PWA安装
  const isInstallSupported = 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
  
  return {
    isInstalled: isStandalone,
    isInstallSupported,
    isStandalone
  };
};

/**
 * 获取设备信息
 */
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMobile = /Mobi|Android/i.test(userAgent);
  const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    isChrome,
    isSafari,
    isFirefox,
    userAgent
  };
};

/**
 * 获取PWA安装指导文本
 */
export const getPWAInstallInstructions = () => {
  const device = getDeviceInfo();
  
  if (device.isIOS && device.isSafari) {
    return {
      title: '添加到主屏幕',
      steps: [
        '点击底部的分享按钮 📤',
        '向下滚动找到"添加到主屏幕"',
        '点击"添加到主屏幕"',
        '确认添加'
      ],
      icon: '🍎'
    };
  }
  
  if (device.isAndroid && device.isChrome) {
    return {
      title: '安装应用',
      steps: [
        '点击地址栏右侧的安装图标',
        '或点击菜单中的"安装应用"',
        '确认安装'
      ],
      icon: '🤖'
    };
  }
  
  if (device.isChrome) {
    return {
      title: '安装应用',
      steps: [
        '点击地址栏右侧的安装图标',
        '或点击菜单 ⋮ > "安装打字训练器"',
        '确认安装'
      ],
      icon: '💻'
    };
  }
  
  return {
    title: '添加到主屏幕',
    steps: [
      '使用支持PWA的浏览器（如Chrome）',
      '点击浏览器菜单',
      '选择"安装应用"或"添加到主屏幕"'
    ],
    icon: '📱'
  };
};

/**
 * 检查网络状态
 */
export const getNetworkStatus = () => {
  return {
    isOnline: navigator.onLine,
    connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
    effectiveType: navigator.connection?.effectiveType || 'unknown'
  };
};

/**
 * 缓存管理
 */
export const cacheManager = {
  /**
   * 清除所有缓存
   */
  async clearAll() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ 所有缓存已清除');
    }
  },

  /**
   * 获取缓存大小
   */
  async getCacheSize() {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        quota: estimate.quota,
        usedMB: Math.round(estimate.usage / 1024 / 1024 * 100) / 100,
        quotaMB: Math.round(estimate.quota / 1024 / 1024 * 100) / 100
      };
    }
    return null;
  },

  /**
   * 预缓存关键资源
   */
  async precacheResources(urls) {
    if ('caches' in window) {
      const cache = await caches.open('precache-v1');
      await cache.addAll(urls);
      console.log('📦 关键资源已预缓存');
    }
  }
};

/**
 * 屏幕唤醒锁定
 */
export const wakeLock = {
  wakeLockSentinel: null,

  /**
   * 请求屏幕保持唤醒
   */
  async request() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLockSentinel = await navigator.wakeLock.request('screen');
        console.log('🔆 屏幕唤醒锁定已激活');
        
        this.wakeLockSentinel.addEventListener('release', () => {
          console.log('😴 屏幕唤醒锁定已释放');
        });
        
        return true;
      } catch (err) {
        console.error('❌ 屏幕唤醒锁定请求失败:', err);
        return false;
      }
    }
    return false;
  },

  /**
   * 释放屏幕唤醒锁定
   */
  async release() {
    if (this.wakeLockSentinel) {
      await this.wakeLockSentinel.release();
      this.wakeLockSentinel = null;
    }
  }
};

/**
 * 全屏模式管理
 */
export const fullscreen = {
  /**
   * 进入全屏模式
   */
  async enter() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    }
  },

  /**
   * 退出全屏模式
   */
  async exit() {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }
  },

  /**
   * 切换全屏模式
   */
  async toggle() {
    if (this.isFullscreen()) {
      await this.exit();
    } else {
      await this.enter();
    }
  },

  /**
   * 检查是否处于全屏模式
   */
  isFullscreen() {
    return !!(document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.msFullscreenElement);
  }
};

/**
 * 应用更新管理
 */
export const appUpdater = {
  /**
   * 检查应用更新
   */
  async checkForUpdates() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('🔄 检查应用更新完成');
      }
    }
  },

  /**
   * 强制更新应用
   */
  async forceUpdate() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }
};

/**
 * 本地存储管理（支持离线）
 */
export const storage = {
  /**
   * 保存数据到本地存储
   */
  set(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('❌ 本地存储保存失败:', error);
      return false;
    }
  },

  /**
   * 从本地存储获取数据
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const data = JSON.parse(item);
      return data.value;
    } catch (error) {
      console.error('❌ 本地存储读取失败:', error);
      return defaultValue;
    }
  },

  /**
   * 删除本地存储数据
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('❌ 本地存储删除失败:', error);
      return false;
    }
  },

  /**
   * 清除所有本地存储
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('❌ 本地存储清除失败:', error);
      return false;
    }
  }
};

/**
 * 性能监控
 */
export const performance = {
  /**
   * 获取页面加载性能数据
   */
  getLoadPerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    }
    return null;
  },

  /**
   * 测量函数执行时间
   */
  measure(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`⏱️ ${name} 执行时间: ${(end - start).toFixed(2)}ms`);
    return result;
  }
};

/**
 * 错误报告
 */
export const errorReporter = {
  /**
   * 报告错误
   */
  report(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };
    
    console.error('🚨 错误报告:', errorInfo);
    
    // 这里可以发送到错误监控服务
    // 例如：Sentry, LogRocket 等
  }
};

// 导出默认对象
const pwaUtils = {
  checkPWAInstallStatus,
  getDeviceInfo,
  getPWAInstallInstructions,
  getNetworkStatus,
  cacheManager,
  wakeLock,
  fullscreen,
  appUpdater,
  storage,
  performance,
  errorReporter
};

export default pwaUtils;
