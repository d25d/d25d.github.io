const fs = require('fs');
const path = require('path');

// 扫描 3ds 文件夹，筛选 .glb 文件
const glbFolder = './3ds';  // 3ds 文件夹路径
const glbFiles = fs.readdirSync(glbFolder)
  .filter(file => file.endsWith('.glb'))  // 只保留 .glb 文件
  .map(file => file.replace('.glb', ''));  // 可选：去掉 .glb 后缀（按钮显示更简洁）

// 生成 files.json（键名可自定义，如 "models"）
fs.writeFileSync('./3ds.json', JSON.stringify({ models: glbFiles }, null, 2));
