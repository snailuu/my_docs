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







## setup name

使用第三方插件 `unplugin-vue-define-options`

安装方法 `npm i unplugin-vue-define-options -D`

```typescript title=vite.config.ts
// vite.config.ts
import DefineOptions from 'unplugin-vue-define-options/vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue(), DefineOptions()],
})
```

配置`tsconfig.json`

```json title=tsconfig.json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["unplugin-vue-define-options/macros-global" /* ... */]
  }
}
```

使用方法 通过编译宏 `defineOptions` 添加`name` 和 `inheritAttrs`

```html
<script setup lang="ts">
defineOptions({
  name: 'Foo',
  inheritAttrs: false,
})
</script>
```

---

使用 [vite](https://so.csdn.net/so/search?q=vite&spm=1001.2101.3001.7020) 插件 `vite-plugin-vue-setup-extend`

安装：`npm i vite-plugin-vue-setup-extend -D`

配置：

```typescript title=vite.config.ts
import { defineConfig } from 'vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
export default defineConfig({
  plugins: [ VueSetupExtend() ]
})
```

使用：

```html
<script lang="ts" setup name="demo">

</script>
```



## `vite`环境插件

```typescript vite/plugin/index.ts
import vue from '@vitejs/plugin-vue';
import createUnoCss from './unocss';
import createAutoImport from './auto-import';
import createComponents from './components';
import createIcons from './icons';
import createSvgIconsPlugin from './svg-icon';
import createCompression from './compression';
import createSetupExtend from './setup-extend';
import createI18n from './i18n';
import path from 'path';

export default (viteEnv: any, isBuild = false): [] => {
  const vitePlugins: any = [];
  vitePlugins.push(vue());
  vitePlugins.push(createUnoCss());
  vitePlugins.push(createAutoImport(path));
  vitePlugins.push(createComponents(path));
  vitePlugins.push(createCompression(viteEnv));
  vitePlugins.push(createIcons());
  vitePlugins.push(createSvgIconsPlugin(path, isBuild));
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createI18n(path));
  return vitePlugins;
};

```

```typescript title=vite.config.ts
import { UserConfig, ConfigEnv, loadEnv, defineConfig } from 'vite';

import createPlugins from './vite/plugins';

import path from 'path';
export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: env.VITE_APP_CONTEXT_PATH,
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    plugins: createPlugins(env, command === 'build'),
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://192.168.0.14:18660',
          // target: 'http://47.121.123.230:18660',
          // target: 'http://192.168.0.181:18660',
          // target: 'http://10.168.1.3:18660',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    // 预编译
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        '@vueuse/core',
        'echarts',
        'vue-i18n',
        '@vueup/vue-quill',
        'bpmn-js/lib/Viewer',
        'bpmn-js/lib/Modeler.js',
        'bpmn-js-properties-panel',
        'min-dash',
        'diagram-js/lib/navigation/movecanvas',
        'diagram-js/lib/navigation/zoomscroll',
        'bpmn-js/lib/features/palette/PaletteProvider',
        'bpmn-js/lib/features/context-pad/ContextPadProvider',
        'diagram-js/lib/draw/BaseRenderer',
        'tiny-svg',
        'image-conversion',
        'element-plus/es/components/**/css'
      ]
    }
  };
});

```

---

下面文件都在 `/vite/plugins` 目录下

```typescript title=index.ts
import vue from '@vitejs/plugin-vue';
import createUnoCss from './unocss';
import createAutoImport from './auto-import';
import createComponents from './components';
import createIcons from './icons';
import createSvgIconsPlugin from './svg-icon';
import createCompression from './compression';
import createSetupExtend from './setup-extend';
import createI18n from './i18n';
import path from 'path';

export default (viteEnv: any, isBuild = false): [] => {
  const vitePlugins: any = [];
  vitePlugins.push(vue());
  vitePlugins.push(createUnoCss());
  vitePlugins.push(createAutoImport(path));
  vitePlugins.push(createComponents(path));
  vitePlugins.push(createCompression(viteEnv));
  vitePlugins.push(createIcons());
  vitePlugins.push(createSvgIconsPlugin(path, isBuild));
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createI18n(path));
  return vitePlugins;
};

```

### 自动导入vue函数

```typescript auto-import.ts
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';

export default (path: any) => {
  return AutoImport({
    // 自动导入 Vue 相关函数
    imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
    eslintrc: {
      enabled: false,
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true
    },
    resolvers: [
      // 自动导入 Element Plus 相关函数ElMessage, ElMessageBox... (带样式)
      ElementPlusResolver(),
      IconsResolver({
        prefix: 'Icon'
      })
    ],
    vueTemplate: true, // 是否在 vue 模板中自动导入
    dts: path.resolve(path.resolve(__dirname, '../../src'), 'types', 'auto-imports.d.ts')
  });
};

```

### 全局注册element组件

```typescript title=components.ts
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';

export default (path: any) => {
  return Components({
    resolvers: [
      // 自动导入 Element Plus 组件
      ElementPlusResolver(),
      // 自动注册图标组件
      IconsResolver({
        enabledCollections: ['ep']
      })
    ],
    dts: path.resolve(path.resolve(__dirname, '../../src'), 'types', 'components.d.ts')
  });
};
```

### 压缩

```typescript title=compression.ts
import compression from 'vite-plugin-compression';

export default (env: any) => {
  const { VITE_BUILD_COMPRESS } = env;
  const plugin: any[] = [];
  if (VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(',');
    if (compressList.includes('gzip')) {
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      plugin.push(
        compression({
          ext: '.gz',
          deleteOriginFile: false
        })
      );
    }
    if (compressList.includes('brotli')) {
      plugin.push(
        compression({
          ext: '.br',
          algorithm: 'brotliCompress',
          deleteOriginFile: false
        })
      );
    }
  }
  return plugin;
};
```

### 国际化

```typescript title=i18n.ts
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
export default (path: any) => {
  return VueI18nPlugin({
    include: [path.resolve(__dirname, '../../src/lang/**.json')]
  });
};
```

### unocss

```typescript title=unocss.ts
import UnoCss from 'unocss/vite';

export default () => {
  return UnoCss({
    hmrTopLevelAwait: false // unocss默认是true，低版本浏览器是不支持的，启动后会报错
  });
};
```

### svg-icon

```typescript svg-icon.ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
export default (path: any, isBuild: boolean) => {
  return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(path.resolve(__dirname, '../../src'), 'assets/icons/svg')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild
  });
};

```

