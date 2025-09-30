const { execSync } = require('child_process');
const fs = require('fs');

try {
  // 检查关键文件是否存在
  const filesToCheck = [
    'src/types/index.ts',
    'src/config/index.ts',
    'src/services/api.service.ts',
    'src/components/ui/Button.tsx',
  ];
  
  console.log('检查关键文件...');
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 不存在`);
    }
  });
  
  console.log('\n尝试编译类型检查...');
  // 尝试简单的语法检查
  execSync('node -c src/types/index.ts', { stdio: 'inherit' });
  console.log('✅ 类型文件语法正确');
  
} catch (error) {
  console.error('❌ 发现问题:', error.message);
}