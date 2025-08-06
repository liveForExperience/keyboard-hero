import React, { useState, useEffect } from 'react';

export default function PWADiagnostic() {
  const [diagnostics, setDiagnostics] = useState({});
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = {};

      // 检查 Service Worker
      results.serviceWorker = {
        supported: 'serviceWorker' in navigator,
        registered: false,
        active: false
      };

      if (results.serviceWorker.supported) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          results.serviceWorker.registered = !!registration;
          results.serviceWorker.active = !!(registration && registration.active);
        } catch (error) {
          results.serviceWorker.error = error.message;
        }
      }

      // 检查 Manifest
      results.manifest = {
        supported: 'manifest' in document.createElement('link'),
        loaded: false,
        valid: false
      };

      try {
        const response = await fetch('/manifest.json');
        results.manifest.loaded = response.ok;
        if (response.ok) {
          const manifest = await response.json();
          results.manifest.valid = !!(manifest.name && manifest.icons && manifest.icons.length > 0);
          results.manifest.data = manifest;
        }
      } catch (error) {
        results.manifest.error = error.message;
      }

      // 检查图标
      results.icons = {
        available: [],
        missing: []
      };

      if (results.manifest.data && results.manifest.data.icons) {
        for (const icon of results.manifest.data.icons) {
          try {
            const response = await fetch(icon.src);
            if (response.ok) {
              results.icons.available.push(icon.src);
            } else {
              results.icons.missing.push(icon.src);
            }
          } catch (error) {
            results.icons.missing.push(icon.src);
          }
        }
      }

      // 检查安装状态
      results.installation = {
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isInstallable: false,
        beforeInstallPromptFired: false
      };

      // 检查 HTTPS
      results.https = {
        isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      };

      setDiagnostics(results);
    };

    runDiagnostics();

    // 监听安装提示事件
    const handleBeforeInstallPrompt = () => {
      setDiagnostics(prev => ({
        ...prev,
        installation: {
          ...prev.installation,
          beforeInstallPromptFired: true,
          isInstallable: true
        }
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const getStatusIcon = (condition) => {
    return condition ? '✅' : '❌';
  };

  const getStatusColor = (condition) => {
    return condition ? 'text-green-600' : 'text-red-600';
  };

  if (!showDiagnostic) {
    return (
      <button
        onClick={() => setShowDiagnostic(true)}
        className="fixed bottom-20 left-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
        title="PWA 诊断"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">PWA 诊断报告</h3>
          <button
            onClick={() => setShowDiagnostic(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Service Worker 状态 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Service Worker</h4>
            <div className="space-y-1 text-sm">
              <div className={getStatusColor(diagnostics.serviceWorker?.supported)}>
                {getStatusIcon(diagnostics.serviceWorker?.supported)} 浏览器支持
              </div>
              <div className={getStatusColor(diagnostics.serviceWorker?.registered)}>
                {getStatusIcon(diagnostics.serviceWorker?.registered)} 已注册
              </div>
              <div className={getStatusColor(diagnostics.serviceWorker?.active)}>
                {getStatusIcon(diagnostics.serviceWorker?.active)} 已激活
              </div>
              {diagnostics.serviceWorker?.error && (
                <div className="text-red-600">错误: {diagnostics.serviceWorker.error}</div>
              )}
            </div>
          </div>

          {/* Manifest 状态 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Web App Manifest</h4>
            <div className="space-y-1 text-sm">
              <div className={getStatusColor(diagnostics.manifest?.supported)}>
                {getStatusIcon(diagnostics.manifest?.supported)} 浏览器支持
              </div>
              <div className={getStatusColor(diagnostics.manifest?.loaded)}>
                {getStatusIcon(diagnostics.manifest?.loaded)} 文件加载成功
              </div>
              <div className={getStatusColor(diagnostics.manifest?.valid)}>
                {getStatusIcon(diagnostics.manifest?.valid)} 配置有效
              </div>
              {diagnostics.manifest?.error && (
                <div className="text-red-600">错误: {diagnostics.manifest.error}</div>
              )}
            </div>
          </div>

          {/* 图标状态 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">PWA 图标</h4>
            <div className="space-y-1 text-sm">
              <div className="text-green-600">
                ✅ 可用图标: {diagnostics.icons?.available?.length || 0}
              </div>
              <div className="text-red-600">
                ❌ 缺失图标: {diagnostics.icons?.missing?.length || 0}
              </div>
              {diagnostics.icons?.missing?.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  缺失: {diagnostics.icons.missing.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* 安装状态 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">安装状态</h4>
            <div className="space-y-1 text-sm">
              <div className={getStatusColor(diagnostics.https?.isSecure)}>
                {getStatusIcon(diagnostics.https?.isSecure)} HTTPS/Localhost
              </div>
              <div className={getStatusColor(diagnostics.installation?.beforeInstallPromptFired)}>
                {getStatusIcon(diagnostics.installation?.beforeInstallPromptFired)} 安装提示可用
              </div>
              <div className={getStatusColor(diagnostics.installation?.isStandalone)}>
                {getStatusIcon(diagnostics.installation?.isStandalone)} 已安装 (独立模式)
              </div>
            </div>
          </div>

          {/* 建议 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 建议</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {!diagnostics.installation?.beforeInstallPromptFired && (
                <div>• 如果看不到安装图标，请尝试刷新页面 (Ctrl+F5)</div>
              )}
              {diagnostics.icons?.missing?.length > 0 && (
                <div>• 部分图标文件缺失，可能影响安装功能</div>
              )}
              {!diagnostics.https?.isSecure && (
                <div>• 生产环境需要 HTTPS 才能完全支持 PWA 功能</div>
              )}
              <div>• 在 Chrome DevTools {'>'}  Application {'>'}  Manifest 中查看详细信息</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
