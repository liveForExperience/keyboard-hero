import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker 注册
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker 注册成功:', registration.scope);
        
        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 有新版本可用
                console.log('🔄 发现新版本，准备更新...');
                if (window.confirm('发现新版本，是否立即更新？')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker 注册失败:', error);
      });
  });
  
  // 监听 Service Worker 控制器变化
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker 已更新');
  });
}

// PWA 安装提示
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💡 PWA 安装提示可用');
  // 阻止默认的安装提示
  e.preventDefault();
  // 保存事件以便稍后触发
  deferredPrompt = e;
  
  // 触发自定义安装提示
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
});

// 监听安装完成事件
window.addEventListener('appinstalled', (e) => {
  console.log('🎉 PWA 安装成功');
  deferredPrompt = null;
  
  // 触发安装完成事件
  window.dispatchEvent(new CustomEvent('pwa-install-success'));
});

// 导出安装函数供组件使用
window.installPWA = async () => {
  if (!deferredPrompt) {
    return { success: false, reason: 'not-available' };
  }
  
  try {
    // 显示安装提示
    deferredPrompt.prompt();
    
    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ 用户接受了安装提示');
      return { success: true };
    } else {
      console.log('❌ 用户拒绝了安装提示');
      return { success: false, reason: 'dismissed' };
    }
  } catch (error) {
    console.error('❌ 安装过程出错:', error);
    return { success: false, reason: 'error', error };
  } finally {
    deferredPrompt = null;
  }
};

// 网络状态监听
function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  document.body.classList.toggle('offline', !isOnline);
  
  window.dispatchEvent(new CustomEvent('network-status-change', {
    detail: { isOnline }
  }));
  
  console.log(isOnline ? '🌐 网络已连接' : '📱 当前离线模式');
}

// 监听网络状态变化
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// 初始化网络状态
updateNetworkStatus();
