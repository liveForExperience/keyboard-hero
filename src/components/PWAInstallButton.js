import React, { useState, useEffect } from 'react';

export default function PWAInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 检查是否已经安装
    const checkInstallStatus = () => {
      // 检查是否在独立模式下运行（已安装）
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone);
      
      // 如果已安装，不显示安装按钮
      if (isStandalone) {
        setShowPrompt(false);
        return;
      }
    };

    // 监听PWA安装可用事件
    const handleInstallAvailable = () => {
      setIsInstallable(true);
      // 延迟显示提示，避免打扰用户
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // 监听PWA安装成功事件
    const handleInstallSuccess = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      setIsInstalling(false);
      
      // 显示成功消息
      showSuccessMessage();
    };

    // 初始检查
    checkInstallStatus();

    // 添加事件监听器
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-success', handleInstallSuccess);

    // 清理事件监听器
    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-success', handleInstallSuccess);
    };
  }, []);

  const handleInstall = async () => {
    if (!window.installPWA) {
      console.error('PWA install function not available');
      return;
    }

    setIsInstalling(true);

    try {
      const result = await window.installPWA();
      
      if (result.success) {
        // 安装成功会通过事件处理
        console.log('✅ PWA installation initiated successfully');
      } else {
        setIsInstalling(false);
        
        if (result.reason === 'dismissed') {
          // 用户取消了安装
          setShowPrompt(false);
          // 一段时间后再次显示提示
          setTimeout(() => {
            setShowPrompt(true);
          }, 300000); // 5分钟后
        } else if (result.reason === 'not-available') {
          // 安装不可用
          setIsInstallable(false);
          setShowPrompt(false);
        }
      }
    } catch (error) {
      console.error('❌ PWA installation failed:', error);
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 记住用户的选择，一段时间内不再显示
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    
    // 24小时后再次显示
    setTimeout(() => {
      const dismissedTime = localStorage.getItem('pwa-install-dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    }, 24 * 60 * 60 * 1000);
  };

  const showSuccessMessage = () => {
    // 创建成功提示
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
      ">
        🎉 应用已成功安装到主屏幕！
      </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // 3秒后移除提示
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  };

  // 如果已安装或不可安装，不显示组件
  if (isInstalled || !isInstallable || !showPrompt) {
    return null;
  }

  return (
    <>
      {/* 安装提示横幅 */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg z-50 animate-slide-up">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📱</div>
            <div>
              <div className="font-semibold">安装打字训练器到主屏幕</div>
              <div className="text-sm opacity-90">获得更好的使用体验，支持离线访问</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>安装中...</span>
                </>
              ) : (
                <>
                  <span>⬇️</span>
                  <span>立即安装</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="text-white hover:text-blue-200 transition-colors p-2"
              title="暂时关闭"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* 浮动安装按钮（备用） */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          title="安装应用到主屏幕"
        >
          {isInstalling ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
