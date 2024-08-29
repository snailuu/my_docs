# 项目中使用vite构建遇到的问题

## 无法识别 ‘@’ 符号

![image-20240829135416583](https://oss.snailuu.cn/picgo/image-20240829135416583.png)

安装 `@types/node` 声明文件

```javascript
npm install @types/node
```

**一、在根目录下的vite.config.ts文件配置**

![image-20240829134453725](https://oss.snailuu.cn/picgo/image-20240829134453725.png)

```javascript title="vite.config.ts"
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	resolve: {
		alias: {
            '@': resolve(__dirname,'./src'),
        },
	}
});
```

**二、根目录下 tsconfig.json 文件中配置**

```javascript title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": "./", // 这里需要配置
    "paths": {
      "@/*": [
        "./src/*"
      ] // 这里需要配置
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

