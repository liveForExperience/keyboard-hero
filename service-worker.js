const CACHE_NAME = 'typing-trainer-v1.0.0';
const STATIC_CACHE = 'typing-trainer-static-v1.0.0';
const DYNAMIC_CACHE = 'typing-trainer-dynamic-v1.0.0';

// 获取基础路径
const BASE_PATH = self.location.pathname.replace('/service-worker.js', '') || '';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/static/js/bundle.js`,
  `${BASE_PATH}/static/css/main.css`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192x192.png`,
  `${BASE_PATH}/icon-512x512.png`
];

// 需要缓存的运行时资源
const RUNTIME_CACHE = [
  `${BASE_PATH}/static/js/`,
  `${BASE_PATH}/static/css/`,
  `${BASE_PATH}/static/media/`
];

// 离线页面HTML
const OFFLINE_PAGE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>离线模式 - Keyboard Hero</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            max-width: 400px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        h1 {
            margin: 0 0 10px 0;
            font-size: 1.8rem;
        }
        p {
            margin: 0 0 30px 0;
            opacity: 0.9;
            line-height: 1.6;
        }
        .retry-btn {
            background: #3B82F6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .retry-btn:hover {
            background: #2563EB;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📱</div>
        <h1>当前处于离线模式</h1>
        <p>打字训练器需要网络连接才能正常使用。请检查您的网络连接后重试。</p>
        <button class="retry-btn" onclick="window.location.reload()">
            🔄 重新连接
        </button>
    </div>
</body>
</html>
`;

// Service Worker 安装事件
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      // 缓存离线页面
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.put('/offline.html', new Response(OFFLINE_PAGE, {
          headers: { 'Content-Type': 'text/html' }
        }));
      })
    ]).then(() => {
      console.log('[SW] Installation completed');
      // 强制激活新的 Service Worker
      return self.skipWaiting();
    })
  );
});

// Service Worker 激活事件
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('typing-trainer-');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // 立即控制所有客户端
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation completed');
    })
  );
});

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

// 处理请求的策略函数
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. 对于导航请求（页面请求）
    if (request.mode === 'navigate') {
      return await handleNavigationRequest(request);
    }
    
    // 2. 对于静态资源
    if (isStaticAsset(url.pathname)) {
      return await handleStaticAssetRequest(request);
    }
    
    // 3. 对于 API 请求
    if (url.pathname.startsWith(`${BASE_PATH}/api/`)) {
      return await handleApiRequest(request);
    }
    
    // 4. 其他请求使用网络优先策略
    return await networkFirst(request);
    
  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    return await handleOfflineRequest(request);
  }
}

// 处理导航请求（页面请求）
async function handleNavigationRequest(request) {
  try {
    // 网络优先
    const networkResponse = await fetch(request);
    
    // 缓存成功的响应
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 返回离线页面
    return caches.match('/offline.html');
  }
}

// 处理静态资源请求
async function handleStaticAssetRequest(request) {
  // 缓存优先策略
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 静态资源请求失败，返回缓存或错误
    throw error;
  }
}

// 处理 API 请求
async function handleApiRequest(request) {
  try {
    // API 请求总是尝试网络优先
    const networkResponse = await fetch(request);
    
    // 可以选择缓存某些 API 响应
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // API 请求失败时，可以返回缓存的响应
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// 网络优先策略
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// 处理离线请求
async function handleOfflineRequest(request) {
  if (request.mode === 'navigate') {
    // 尝试返回缓存的主页面或创建离线页面
    const cachedIndex = await caches.match(`${BASE_PATH}/`);
    if (cachedIndex) {
      return cachedIndex;
    }
    // 返回内联的离线页面
    return new Response(OFFLINE_PAGE, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // 对于其他类型的请求，返回缓存或错误响应
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return new Response('Offline', { 
    status: 503, 
    statusText: 'Service Unavailable' 
  });
}

// 判断是否为静态资源
function isStaticAsset(pathname) {
  return RUNTIME_CACHE.some(pattern => pathname.startsWith(pattern)) ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico') ||
         pathname.endsWith('.woff') ||
         pathname.endsWith('.woff2');
}

// 监听消息事件（用于缓存更新通知）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// 后台同步事件（如果支持）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 后台同步处理函数
async function doBackgroundSync() {
  console.log('[SW] Performing background sync');
  // 这里可以处理离线时的数据同步
}

// 推送通知事件（如果需要）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'open',
          title: '打开应用',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: '关闭',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker script loaded');
