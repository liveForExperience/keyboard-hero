import React from 'react';
import TypingTrainer from './components/TypingTrainer';
import PWAInstallButton from './components/PWAInstallButton';
import PWADiagnostic from './components/PWADiagnostic';
import { useNetworkStatus, useAppUpdate } from './hooks/usePWA';

function App() {
  const { isOnline } = useNetworkStatus();
  const { updateAvailable, updateApp } = useAppUpdate();

  return (
    <div className="App">
      {/* 网络状态指示器 */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm z-50">
          📱 当前处于离线模式，部分功能可能受限
        </div>
      )}
      
      {/* 应用更新提示 */}
      {updateAvailable && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-3 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🔄</span>
              <span>发现新版本，点击更新获得最新功能</span>
            </div>
            <button
              onClick={updateApp}
              className="bg-white text-green-600 px-4 py-1 rounded font-medium text-sm hover:bg-green-50 transition-colors"
            >
              立即更新
            </button>
          </div>
        </div>
      )}
      
      {/* PWA安装按钮 */}
      <PWAInstallButton />
      
      {/* PWA诊断工具 */}
      <PWADiagnostic />
      
      {/* 主应用内容 */}
      <TypingTrainer />
    </div>
  );
}

export default App;
