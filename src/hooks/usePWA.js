import { useState, useEffect, useCallback, useRef } from 'react';
import { checkPWAInstallStatus, getNetworkStatus, storage } from '../utils/pwa';

/**
 * PWA功能的自定义Hook
 */
export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // 检查安装状态
  useEffect(() => {
    const checkStatus = () => {
      const status = checkPWAInstallStatus();
      setIsInstalled(status.isInstalled);
    };

    checkStatus();
    
    // 监听显示模式变化
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => checkStatus();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // 监听PWA安装事件
  useEffect(() => {
    const handleInstallAvailable = () => setIsInstallable(true);
    const handleInstallSuccess = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-success', handleInstallSuccess);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-success', handleInstallSuccess);
    };
  }, []);

  // 监听网络状态
  useEffect(() => {
    const handleNetworkChange = (event) => {
      setIsOnline(event.detail.isOnline);
    };

    window.addEventListener('network-status-change', handleNetworkChange);
    
    return () => {
      window.removeEventListener('network-status-change', handleNetworkChange);
    };
  }, []);

  // 监听Service Worker更新
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  // 安装PWA
  const installPWA = useCallback(async () => {
    if (window.installPWA) {
      return await window.installPWA();
    }
    return { success: false, reason: 'not-available' };
  }, []);

  // 更新应用
  const updateApp = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  }, []);

  return {
    isInstalled,
    isInstallable,
    isOnline,
    updateAvailable,
    installPWA,
    updateApp
  };
};

/**
 * 网络状态Hook
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkInfo, setNetworkInfo] = useState(getNetworkStatus());

  useEffect(() => {
    const updateNetworkStatus = () => {
      const status = getNetworkStatus();
      setIsOnline(status.isOnline);
      setNetworkInfo(status);
    };

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 监听连接变化（如果支持）
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    connection: networkInfo.connection,
    effectiveType: networkInfo.effectiveType
  };
};

/**
 * 本地存储Hook
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return storage.get(key, defaultValue);
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      // 允许传入函数来更新值
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  const removeStoredValue = useCallback(() => {
    try {
      setValue(defaultValue);
      storage.remove(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
};

/**
 * 屏幕唤醒锁定Hook
 */
export const useWakeLock = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSupported] = useState(false);
  const wakeLockRef = useRef(null);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const wakeLock = await navigator.wakeLock.request('screen');
      setIsActive(true);

      wakeLock.addEventListener('release', () => {
        setIsActive(false);
      });

      wakeLockRef.current = wakeLock;

      return true;
    } catch (error) {
      console.error('Wake lock request failed:', error);
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      setIsActive(false);
    }
  }, []);

  return {
    isActive,
    isSupported,
    requestWakeLock,
    releaseWakeLock
  };
};

/**
 * 全屏模式Hook
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported] = useState(
    !!(document.fullscreenEnabled ||
       document.webkitFullscreenEnabled ||
       document.msFullscreenEnabled)
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (!isSupported) return false;

    const element = document.documentElement;
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Enter fullscreen failed:', error);
      return false;
    }
  }, [isSupported]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Exit fullscreen failed:', error);
      return false;
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      return await exitFullscreen();
    } else {
      return await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};

/**
 * 应用更新Hook
 */
export const useAppUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });

      // 检查现有的更新
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const updateApp = useCallback(async () => {
    if (!updateAvailable) return false;

    setIsUpdating(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          // 等待一小段时间让Service Worker处理
          setTimeout(() => {
            window.location.reload();
          }, 100);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('App update failed:', error);
      setIsUpdating(false);
      return false;
    }
  }, [updateAvailable]);

  const checkForUpdates = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      } catch (error) {
        console.error('Check for updates failed:', error);
      }
    }
  }, []);

  return {
    updateAvailable,
    isUpdating,
    updateApp,
    checkForUpdates
  };
};

export default usePWA;
