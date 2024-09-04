# typescript

## 常用语法

### Omit省略/剔除

**作用**： 去除类型中某些项

```typescript title=源码
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>; 
```

**参数**：第一个为继承的type类型，第二个为想要的key的字符串，多个字符串用|分开

**使用方式**：

```typescript
interface UserObj {
    readonly name: string; // readonly 只读属性 只能初始化定义 不能二次赋值
    age: number;
    id: number;
    sex: 0 | 1;
    address: string;
    weight: number;
}

// 剔除省略自己不需要的
type Person = Omit<UserObj, "age" | "sex"  | "address" | "weight">;

// 此时Person 等同于 Person1

interface Person1 {
    readonly name: string;
    id: number;
}


```





### Pick采集

>   可以采集 已定义对象中 自己需要的一部分形成新的定义类型。

```typescript
interface UserObj {
    readonly name: string;
    age: number;
    id: number;
    sex: 0 | 1;
    address: string;
    weight: number;
 }
 
 // 采集需要的
 type Person = Pick<UserObj, "name" | "id">;
 
 // 此时Person 等同于 Person1
 interface Person1 {
     readonly name: string;
     id: number;
}
```



```typescript title=源码
// Pick 的源码
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```





### Partial

>   可把定义好的对象（包含 必选+可选项）类型全部转化为**可选项**

```typescript title=源码
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```



```typescript
// 已有定义类型Person
interface Person {
    name: string;
    age: number;
    id: number;
    sex: 0 | 1;
    address: string;
    weight: number;
}

// 使用方法
const newObj: Partial<Person> = {
    name: '张三' // 假如只需要一项 Partial的便捷性 可以不需要从新定义类型
};

// Partial<Person>等同于 NewPerson
interface NewPerson {
    name?: string;
    age?: number;
    id?: number;
    sex?: 0 | 1;
    address?: string;
    weight?: number;
}
```







### Required
