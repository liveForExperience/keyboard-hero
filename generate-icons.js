const fs = require('fs');
const path = require('path');

// 创建简单的 SVG 图标
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad1)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="central">⌨️</text>
</svg>`;
};

// 需要创建的图标尺寸
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 创建 public/icons 目录
const iconsDir = path.join(__dirname, 'public');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 开始生成 PWA 图标...');

// 为每个尺寸创建 SVG 文件（作为临时解决方案）
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ 创建图标: ${filename}`);
});

// 创建 Apple Touch Icon (使用 192x192 的 SVG)
const appleTouchIcon = createSVGIcon(192);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('✅ 创建 Apple Touch Icon');

console.log('\n🎉 PWA 图标生成完成！');
console.log('\n📝 注意事项：');
console.log('1. 这些是 SVG 格式的临时图标');
console.log('2. 生产环境建议使用 PNG 格式图标');
console.log('3. 可以使用在线工具将 SVG 转换为 PNG');
console.log('4. 推荐工具: https://realfavicongenerator.net/');

// 更新 manifest.json 以使用 SVG 图标
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 更新图标配置为 SVG 格式
manifest.icons = iconSizes.map(size => ({
  src: `icon-${size}x${size}.svg`,
  sizes: `${size}x${size}`,
  type: 'image/svg+xml',
  purpose: size >= 192 ? 'maskable any' : 'any'
}));

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ 更新 manifest.json 图标配置');

console.log('\n🚀 现在可以重新启动应用测试 PWA 安装功能！');
