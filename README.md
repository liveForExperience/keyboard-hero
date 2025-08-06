# 打字训练器 PWA (Typing Trainer Progressive Web App)

一个专为青少年设计的现代化打字练习应用，采用 React + Tailwind CSS 构建，**完整的 PWA 支持**，提供原生应用般的用户体验。

## 🌟 功能特色

### 📱 PWA 核心功能
- ✅ **安装到主屏幕** - 像原生应用一样使用
- ✅ **离线访问** - 无网络也能正常使用
- ✅ **独立窗口运行** - 无浏览器界面干扰
- ✅ **自动更新** - 智能检测和提示更新
- ✅ **快速启动** - 优化的缓存策略
- ✅ **推送通知** - 支持后台通知（可选）

### 🎯 打字训练功能
- 🎯 **三个难度等级**：初级、中级、高级，适合不同水平的用户
- ⚡ **实时统计**：WPM（每分钟字数）、准确率、错误计数
- 🏆 **成绩追踪**：最佳速度记录、连胜统计
- 🎨 **现代化UI**：响应式设计，支持移动端
- 🌟 **动画效果**：流畅的过渡动画和庆祝效果
- 📊 **详细反馈**：练习完成后的详细成绩分析
- 💾 **本地存储**：数据持久化，支持离线使用

## 🛠️ 技术栈

- **前端框架**: React 18
- **样式框架**: Tailwind CSS 3
- **PWA技术**: Service Worker, Web App Manifest
- **缓存策略**: Cache API, Background Sync
- **存储方案**: LocalStorage, IndexedDB（可扩展）
- **构建工具**: Create React App
- **语言**: JavaScript ES6+

## 🚀 快速开始

### 📋 环境要求

- **Node.js**: 16.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **现代浏览器**: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+

### 🔧 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd keyboard-hero
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm start
   ```
   应用将在 [http://localhost:3000](http://localhost:3000) 启动

4. **构建生产版本**
   ```bash
   npm run build
   ```

### 🌐 PWA 部署要求

**重要**: PWA 功能需要 HTTPS 环境才能完全工作（开发环境 localhost 除外）

#### 推荐部署平台:
- **Netlify**: 自动 HTTPS，支持 SPA
- **Vercel**: 零配置部署
- **GitHub Pages**: 免费静态托管
- **Firebase Hosting**: Google 官方 PWA 支持

#### 部署示例 (Netlify):
```bash
# 构建项目
npm run build

# 部署到 Netlify
npx netlify-cli deploy --prod --dir=build
```

## 项目结构

```
typing-trainer/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   ├── manifest.json      # PWA配置
│   └── favicon.ico        # 网站图标
├── src/
│   ├── components/        # React组件
│   │   ├── TypingTrainer.js    # 主训练组件
│   │   ├── StatsCard.js        # 统计卡片
│   │   ├── TextDisplay.js      # 文本显示
│   │   ├── LevelSelector.js    # 难度选择
│   │   └── ResultModal.js      # 结果弹窗
│   ├── utils/             # 工具函数
│   │   ├── textData.js         # 练习文本数据
│   │   └── calculations.js     # 计算函数
│   ├── styles/            # 样式文件
│   │   └── index.css           # 全局样式
│   ├── App.js             # 根组件
│   └── index.js           # 入口文件
├── package.json           # 项目配置
├── tailwind.config.js     # Tailwind配置
├── postcss.config.js      # PostCSS配置
└── README.md              # 项目说明
```

## 📱 PWA 安装和使用指南

### 🔽 安装 PWA 应用

#### **Chrome/Edge (推荐)**
1. 访问应用网址
2. 点击地址栏右侧的 **安装图标** 📥
3. 或点击右上角菜单 ⋮ → "安装打字训练器"
4. 点击 "安装" 确认

#### **Safari (iOS)**
1. 访问应用网址
2. 点击底部 **分享按钮** 📤
3. 向下滚动找到 "添加到主屏幕"
4. 点击 "添加" 确认

#### **Android Chrome**
1. 访问应用网址
2. 会自动显示安装横幅
3. 点击 "安装" 或 "添加到主屏幕"

### 🎯 使用说明

#### **基础使用**
1. **选择难度等级**：根据你的打字水平选择初级、中级或高级
2. **开始练习**：点击"开始练习"按钮或直接开始输入
3. **实时反馈**：观察文本高亮显示，绿色表示正确，红色表示错误
4. **查看统计**：练习过程中可以看到实时的速度、准确率等统计信息
5. **完成练习**：输入完成后查看详细的成绩报告

#### **PWA 特色功能**
- 📱 **离线使用**：无网络时也能正常练习
- 🔄 **自动更新**：有新版本时会自动提示更新
- 🏠 **主屏幕访问**：从手机主屏幕直接启动
- 💾 **数据保存**：练习记录自动保存到本地
- 🌙 **后台运行**：支持后台保持活跃状态

## 特性说明

### 难度等级

- **初级 🌱**：简单单词和短句，适合打字初学者
- **中级 🚀**：技术相关文本，适合有一定基础的用户
- **高级 ⚡**：复杂的专业术语和长句，适合高级用户

### 统计指标

- **WPM (Words Per Minute)**：每分钟打字数，标准计算方式（每5个字符算一个词）
- **准确率**：正确字符数占总字符数的百分比
- **连胜记录**：连续获得95%以上准确率的次数

### 成绩评级

- 🏆 **优秀**：准确率≥95% 且 WPM≥60
- 👍 **良好**：准确率≥90% 且 WPM≥40
- ⭐ **一般**：准确率≥85%
- 💪 **需要练习**：准确率≥80%
- 📈 **需要提高**：准确率<80%

## 🧪 PWA 功能测试

### ✅ 测试清单

#### **基础 PWA 功能**
- [ ] **安装测试**: 能否正常安装到主屏幕
- [ ] **独立运行**: 安装后是否以独立窗口运行
- [ ] **离线访问**: 断网后是否仍能使用
- [ ] **缓存功能**: 二次访问是否快速加载
- [ ] **更新机制**: 代码更新后是否提示用户

#### **Lighthouse PWA 审计**
1. 打开 Chrome DevTools (F12)
2. 切换到 "Lighthouse" 标签
3. 选择 "Progressive Web App"
4. 点击 "Generate report"
5. **目标分数**: PWA 100/100

#### **手动测试步骤**

**1. 安装功能测试**
```bash
# 启动开发服务器
npm start

# 在 Chrome 中访问 http://localhost:3000
# 观察地址栏是否出现安装图标
# 点击安装并确认
```

**2. 离线功能测试**
```bash
# 安装应用后
# 1. 断开网络连接
# 2. 从主屏幕启动应用
# 3. 验证应用是否正常工作
# 4. 尝试进行打字练习
```

**3. Service Worker 测试**
```bash
# 在 Chrome DevTools 中
# 1. Application → Service Workers
# 2. 查看 SW 状态是否为 "activated"
# 3. Application → Storage → Cache Storage
# 4. 验证缓存文件是否存在
```

### 🔧 开发和调试

#### **Service Worker 调试**
```javascript
// 在浏览器控制台中检查 SW 状态
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('SW Registrations:', registrations);
});

// 检查缓存
caches.keys().then(cacheNames => {
  console.log('Cache Names:', cacheNames);
});
```

#### **PWA 安装状态检查**
```javascript
// 检查是否已安装
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
console.log('Is installed:', isStandalone);

// 检查安装提示是否可用
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt available');
});
```

## 🛠️ 开发说明

### 📁 PWA 相关文件结构
```
src/
├── components/
│   └── PWAInstallButton.js    # PWA 安装组件
├── hooks/
│   └── usePWA.js             # PWA 功能 Hooks
├── utils/
│   └── pwa.js                # PWA 工具函数
public/
├── manifest.json             # PWA 配置文件
├── service-worker.js         # Service Worker
└── icons/                    # PWA 图标文件
```

### 🎨 自定义开发

#### **添加练习文本**
在 `src/utils/textData.js` 中添加：
```javascript
export const practiceTexts = {
  beginner: [
    "新的初级练习文本"
  ],
  // ...
};
```

#### **自定义 PWA 配置**
修改 `public/manifest.json`：
```json
{
  "name": "你的应用名称",
  "theme_color": "#你的主题色",
  "background_color": "#你的背景色"
}
```

#### **自定义缓存策略**
修改 `public/service-worker.js` 中的缓存配置：
```javascript
const CACHE_NAME = 'your-app-v1.0.0';
const STATIC_ASSETS = [
  // 添加需要缓存的资源
];
```

## 🌐 浏览器支持

### PWA 功能支持

| 浏览器 | 安装支持 | 离线支持 | 推送通知 | 后台同步 |
|--------|----------|----------|----------|----------|
| Chrome 88+ | ✅ | ✅ | ✅ | ✅ |
| Firefox 78+ | ✅ | ✅ | ✅ | ❌ |
| Safari 14+ | ✅ | ✅ | ✅ | ❌ |
| Edge 88+ | ✅ | ✅ | ✅ | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ | ✅ |

### 推荐使用
- **桌面**: Chrome, Edge (最佳 PWA 体验)
- **iOS**: Safari (原生集成)
- **Android**: Chrome (完整功能支持)

## 🚨 常见问题

### Q: 为什么看不到安装提示？
A: 确保满足以下条件：
- 使用 HTTPS 或 localhost
- 有有效的 manifest.json
- Service Worker 已注册
- 应用未安装过

### Q: 离线功能不工作？
A: 检查：
- Service Worker 是否正常注册
- 缓存策略是否正确
- 网络请求是否被正确拦截

### Q: 如何更新 PWA？
A: 应用会自动检测更新并提示用户，也可以手动刷新页面强制更新。

## 📊 性能指标

### Lighthouse 评分目标
- **Performance**: 90+ 🚀
- **Accessibility**: 90+ ♿
- **Best Practices**: 90+ ✅
- **PWA**: 100 📱
- **SEO**: 90+ 🔍

### 加载性能
- **首次内容绘制 (FCP)**: < 1.5s
- **最大内容绘制 (LCP)**: < 2.5s
- **首次输入延迟 (FID)**: < 100ms
- **累积布局偏移 (CLS)**: < 0.1

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 遵循 ESLint 配置
- 添加适当的注释
- 确保 PWA 功能正常
- 更新相关文档

## 📞 支持

如有问题或建议，请：
- 提交 [Issue](../../issues)
- 发起 [Discussion](../../discussions)
- 查看 [Wiki](../../wiki) 文档

---

**享受打字练习，提升技能！** ⌨️✨
