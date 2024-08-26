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

