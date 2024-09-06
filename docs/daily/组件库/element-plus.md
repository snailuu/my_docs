# element-Plus 疑难杂症

## 可编辑表格校验

![image-20240826130803563](https://oss.snailuu.cn/picgo/image-20240826130803563.png)

> 如果错误信息显示不全在 el-form-item  标签中加上  :inline-message="true"

### 一、直接在 table 外嵌套一层 form

```html
<template>
  <el-form :model="data">
    <el-table :data="data.tableData" style="width: 100%">
      <el-table-column label="名称" prop="name">
        <template #default="scope">
          <el-form-item :prop="`tableData[${scope.$index}].name`" :rules="rules.name" :inline-message="true">
            <el-input v-model="scope.row.name"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="date">
        <template #default="scope">
          <el-input v-model="scope.row.date"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address">
        <template #default="scope">
          <el-input v-model="scope.row.address"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-form>

</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const data = reactive({
  tableData: [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ]
})

const rules = {
  name: [{ required: true, message: "请输入活动名称", trigger: "blur" },
  {
    min: 3,
    max: 5,
    message: "长度在 3 到 5 个字符",
    trigger: "blur",
  },]
}
</script>
```

### 二、在要添加校验的那一列套一层form

> 需要注意的地方 el-form 需要绑定 :model="scope.row"

```html
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="名称" prop="name">
      <template #default="scope">
        <el-form :model="scope.row" :rules="rules">
          <el-form-item prop="name" :inline-message="true">
            <el-input v-model="scope.row.name"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="日期" prop="date">
      <template #default="scope">
        <el-input v-model="scope.row.date"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="地址" prop="address">
      <template #default="scope">
        <el-input v-model="scope.row.address"></el-input>
      </template>
    </el-table-column>
  </el-table>

</template>

<script lang="ts" setup>

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const rules = {
  name: [{ required: true, message: "请输入活动名称", trigger: "blur" },
  {
    min: 3,
    max: 5,
    message: "长度在 3 到 5 个字符",
    trigger: "blur",
  },]
}
</script>
```





## 二次封装组件暴露子组件方法

```html title=Myinput.vue
<template>
  <div>myinput</div>
  <el-input ref="inputRef" v-bind="$attrs">
    <template v-for="(_, slot) in $slots" :key="slot" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
  </el-input>
</template>
<script setup lang='ts'>


const inputRef = ref()

defineExpose(
  new Proxy(
    {},
    {
      get(target, key) {
        return inputRef.value?.[key]
      },
      has(target, key) {
        return key in inputRef.value
      }
    }
  )
)
</script>
<style scoped lang='less'></style>
```

```html title=App.vue
<template>
  <el-button type="primary" @click="focus">聚焦</el-button>
  <MyInput v-model="msg" ref="myInputRef">
    <template #append>
      <el-button>前置</el-button>
    </template>
    <template #prepend>
      <el-button>后置</el-button>
    </template>
  </MyInput>
  {{ msg }}
</template>
<script setup lang='ts'>
import MyInput from '@/components/MyInput.vue'

const msg = ref('111')

const myInputRef = ref()

const focus = () => {
  myInputRef.value.focus()
}
</script>
<style scoped lang='less'></style>
```



## loading组件短时间内多个接口重复加载loading问题

```typescript
import { ElLoading } from "element-plus";
// 其他自己的代码省略

// const instance = axios.create({
//   baseURL: "/api",
//   timeout: 10000, // 请求超时时间
// });

// 定义计数和定时器
let loadingTimer: NodeJS.Timeout | null = null;
let timerCount: number = 0;

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    timerCount++; // 每次请求++
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    timerCount--; // 每次请求--
    return response.data;
  },
  (error) => {
    timerCount--;
    return Promise.reject(error);
  }
);

// 加载loading。其他请求方法自行写
const loadingInstance =
 ElLoading.service({
   lock: true,
   fullscreen: true,
 })


// 请求完毕的回调函数判断关闭loading、而不是请求完一次就关闭一次。关键解决代码：
if (loadingTimer) {
  clearTimeout(loadingTimer);
}
loadingTimer = setTimeout(() => {
  if (timerCount === 0) {
    loadingInstance?.close();
  }
}, 300); // 300毫秒同时请求的间隔关闭时间

```

