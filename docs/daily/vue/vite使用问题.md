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



注： 如果输入 @ 无法识别路径使用以下方法

添加插件：`Path Autocomplete` 然后点击设置

![image-20240831210519716](http://oss.snailuu.cn/picgo/image-20240831210519716.png)

```json
    //导入文件时是否携带文件的拓展名
    "path-autocomplete.extensionOnImport": true,
    //配置@的路径提示
    "path-autocomplete.pathMappings": {
        "@": "${folder}/src"
    },
```

![请添加图片描述](http://oss.snailuu.cn/picgo/da47af6c6cf2ad404cca83729f56b641.gif)





## 自动导入

**安装插件**

```shell
npm i unplugin-auto-import -D
```

**配置插件**

在 `vite.config.ts`  中增加以下代码

```typescript title=vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path';
import { fileURLToPath, URL } from "url";
 
// 新npm install的包，这里导入如果报异常警告，就重启下IDE
 
export default defineConfig({
 
  plugins: [vue(),vueJsx(),
    //增加下面这段代码，自动导入vue核心的包
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/,
      ],
      imports: ['vue','vue-router', 'pinia', '@vueuse/core'],
      //注意这个配置和src同级
      dts: './auto-imports.d.ts'
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
})
```

配置完成后，运行 [npm](https://so.csdn.net/so/search?q=npm&spm=1001.2101.3001.7020) run dev 命令，会自动在项目根目录位置下生成 auto-imports.d.ts 这个文件

**配置tsconfig.json**

```json title=tsconfig.json
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "./*.d.ts",
    "./auto-imports.d.ts",
    "node_modules/unplugin-auto-import/auto-imports.d.ts",
  ]
```

