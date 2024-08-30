# tailwindcss

## 动态类名

官方文档说明：[点击前往](https://tailwindcss.com/docs/content-configuration#dynamic-class-names)

在之前可能会使用下面这种写法

```html
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>
```

但官方**推荐**下面这种写法

```html
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```



如果是通过组件方式的**props引入**的话，也不建议下面这种写法

```jsx
function Button({ color, children }) {
  return (
    <button className={`bg-${color}-600 hover:bg-${color}-500 ...`}>
      {children}
    </button>
  )
}
```

改为下面这种

```jsx
function Button({ color, children }) {
  const colorVariants = {
    blue: 'bg-blue-600 hover:bg-blue-500',
    red: 'bg-red-600 hover:bg-red-500',
  }

  return (
    <button className={`${colorVariants[color]} ...`}>
      {children}
    </button>
  )
}
```

