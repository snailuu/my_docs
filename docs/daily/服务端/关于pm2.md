```bash

# 日志管理
pm2 logs
pm2 logs 进程名称
pm2 logs 进程id


# 进程管理
## 超过 200M 内存自动重启：
pm2 start xxx --max-memory-restart 200M

## 从 2s 开始每 3s 重启一次：
pm2 start xxx --cron-restart "2/3 * * * * *"

## 当文件内容改变自动重启：
pm2 start xxx --watch

## 不自动重启：
pm2 start xxx --no-autorestart

## 先把之前的日志清空，使用
pm2 flush # 或者
pm2 flush 进程名|id

## 查看 main 进程的前 100 行日志：
pm2 logs main --lines 100


pm2 start
pm2 stop
pm2 restart
pm2 delete

# 负载均衡
pm2 start app.js -i max
pm2 start app.js -i 0

pm2 status

pm2 start ./dist/main.js -i 0

## 跑起来之后，还可以动态调整进程数，通过 pm2 scale：
## 我把 main 的集群调整为 3 个进程：
pm2 scale 3

## 我又加了 3 个，现在变成了 6 个：
pm2 scale main +3

## 可以动态伸缩进程的数量，pm2 会把请求分配到不同进程上去。

# 性能监控
pm2 monit
pm2 monit --help

## pm2 支持配置文件的方式启动多个应用。

```