class PromisePool {
    constructor(max) {
        this.max = max // 最大并发数
        this.num = 0 // 当前并发数
        this.index = 0 // 用于保证result中的顺序与taskList中的顺序相同
        this.result = [] // 保存所有Promise的结果
        this.taskList = [] // Promise列表
    }

    // 单例模式实现，在taskList中的全部任务完成之前，多次调用start会返回同一个Promise
    static result = null
        // 添加任务，每个任务是一个返回Promise的函数，或者是由此类函数组成的数组

    addTask(item) {
        if (Array.isArray(item)) this.taskList.concat(item)
        else this.taskList.push(item)
    }

    // 开始执行任务
    start() {
        // 如果PromisePool.result有值，则直接返回该值即可
        if (!PromisePool.result) {
            PromisePool.result = new Promise(resolve => {
                // 使并发数达到最大值
                while (this.num < this.max && this.taskList.length) {
                    let item = this.taskList.shift()
                    this.setTask(item, this.index, resolve)
                    this.num++
                }
            })
        }
        // 返回一个Promise，便于使用then()方法获取所有taskList中所有Promise的结果
        return PromisePool.result
    }

    // 执行Promise
    setTask(item, index, resolve) {
        this.index++
            // Promise成功或失败的结果均以对象的形式存储到result中，类似Promise.allSettled方法
            item().then(data => {
                this.result[index] = { state: 'fulfilled', data }
            }, error => {
                this.result[index] = { state: 'rejected', error }
            }).then(() => {
                this.num--
                    // 如果taskList中还有任务，则取出第一项重复该过程
                    if (this.taskList.length) {
                        let newItem = this.taskList.shift()
                        this.setTask(newItem, this.index, resolve)
                        this.num++
                    }
                    // 如果并发数为0，表示所有任务完成，调用resolve方法并重置各项属性
                if (this.num === 0) {
                    resolve(this.result)
                    PromisePool.result = null
                    this.index = 0
                    this.result = []
                }
            })
    }
}
// 使用案例，每一个item都是一个返回Promise的函数
let item1 = function() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(1)
            resolve(1)
        }, 1000)
    })
}
let item2 = function() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(2)
            resolve(2)
        }, 2000)
    })
}
let item3 = function() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(3)
            resolve(3)
        }, 2000)
    })
}
let item4 = function() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(4)
            resolve(4)
        }, 3000)
    })
}
let item5 = function() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(5)
            resolve(5)
        }, 4000)
    })
}
let item6 = function() {
    console.log(6)
    return Promise.resolve(6)
}
let item7 = function() {
    console.log(7)
    return Promise.reject(7)
}
const promisePool = new PromisePool(2)
promisePool.addTask(item1)
promisePool.addTask(item2)
promisePool.addTask(item3)
promisePool.addTask(item4)
promisePool.addTask(item5)
promisePool.addTask(item6)
promisePool.addTask(item7)
promisePool.start().then(data => {
        console.log(data)
    })
    // 多次调用start方法返回同一个promises
promisePool.start().then(data => {
    console.log(data)
})
promisePool.start().then(data => {
        console.log(data)
    })
    // 会依次打印 1 2 3 4 6 7 5，然后打印三次相同的数组（长度为7）