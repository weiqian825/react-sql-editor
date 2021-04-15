init: # 初始化环境
	npm install
	npm install -g yalc nodemon

push: # 手动构建与 push
	npm run build
	yalc push
	
watch: # 自动监听文件变化并执行构建与 push 任务
	nodemon
