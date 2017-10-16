<template>
	<div class="auto">
		<!-- <p class="folder-path"> {{folderPath}}</p> -->
		<Button type="ghost" @click="addFolder">
			<Icon type="plus-round"></Icon> 选择创建地址
		</Button>
		<Button type="ghost" disabled>
			<Icon title="配置" type="gear-b"></Icon>发布
		</Button>
		
		<!-- 项目列表 -->
		<ul>
			<li v-for="(item,index) in projectList" :key="index" >
				<div class="auto-item">
					<div class="item-folder">
			            <Icon class="file-folder" type="folder"></Icon>
			        </div>
			        <div class="item-file">
			            <p class="title">{{item.name}}</p>
			            <p class="path">{{item.folderPath}}</p>
			        </div>

			        <div class="item-operation">
			            <i-switch class="switch" color="#f00" v-model="item.isActive" size="small" @on-change="startLiveLoad(item)"></i-switch>

			            <Icon class="operation-btn" type="ios-trash-outline" title="删除" @click.native="deleteItem(item)"></Icon>
			        </div>
				</div>
			</li>
		</ul>
		<!-- <auto-item :item="item" v-for="(item,index) in projectList" :key="index"></auto-item> -->

		<!-- 创建配置弹出层 -->
		<transition name="fade" mode="out-in">
		  	<div class="layer" v-if="isShowLayer">
		  		<Progress :percent="percent" hide-info :status="status" :stroke-width="2" class="process"></Progress>
				<Icon type="close-round" class="close" @click.native="closeLayer"></Icon>
				<h5>项目名称</h5>
				<div class="layer-box">
					<input type="text" v-model="config.name" autofocus class="work-name" placeholder="如：myProject" />
				</div>
				<h5>工作区路径</h5>
				<div class="layer-box">
					<div class="work-path">{{folderPath}}</div>
				</div>
				<h5>默认启动页</h5>
				<div class="layer-box">
					<input type="text" v-model="defaultStart" autofocus class="work-name" />
				</div>
				<h5>功能</h5>
				<div class="layer-box">
					<ul class="layer-ul">
					    <li>
					    	<Checkbox v-model="functions.liveLoad">开启 LiveReload 浏览器自动刷新 (默认开启)</Checkbox>
					    </li>
					</ul>
				</div>
				<!-- <h5>boot 配置</h5>
				<div class="layer-box">
					<CheckboxGroup v-model="functions">
						<ul class="layer-ul">
						    <li><Checkbox label="compress">是否采用压缩资源</Checkbox></li>
						    <li><Checkbox label="mock">是否加载 mock.js 和 本地测试数据</Checkbox></li>
						</ul>
				    </CheckboxGroup>
				</div> -->
				<div class="auto-start">
						<!-- <div class="start-circle" @click="createProject">创建</div> -->
						<Button type="success" long @click.native="createProject">确认创建</Button>
					</div>
			</div>
		</transition>

		<!-- 发布配置弹出层 -->
		<transition name="fade" mode="out-in">
		  	<div class="layer" v-if="isShowPublish">
		  		<Progress :percent="percent" hide-info :status="status" :stroke-width="2" class="process"></Progress>
				<Icon type="close-round" class="close" @click.native="closeLayer"></Icon>
				<h5>工作区路径</h5>
				<div class="layer-box">
					<div class="work-path">{{folderPath}}</div>
				</div>
				<h5>功能</h5>
				<div class="layer-box">
					<CheckboxGroup v-model="functions">
						<ul class="layer-ul">
						    <li><Checkbox label="browser">开启 LiveReload 浏览器自动刷新</Checkbox></li>
						    <li><Checkbox label="miniCss">开启 压缩 css 解决方案</Checkbox></li>
						    <li><Checkbox label="miniJS">开启 混淆压缩 JS 解决方案</Checkbox></li>
						    <!-- <li><Checkbox label="hash">开启 文件版本去缓存解决方案</Checkbox></li> -->

						    <li><Checkbox label="autoprefixer">开启 autoprefixer 解决方案</Checkbox></li>
						    <li><Checkbox label="sprite">开启 整合压缩雪碧图 解决方案</Checkbox></li>
						    <li><Checkbox label="base64">开启 转换图片为 base64 格式</Checkbox></li>
						    <li></li>
						</ul>
				    </CheckboxGroup>
				</div>
				<!-- <h5>boot 配置</h5>
				<div class="layer-box">
					<CheckboxGroup v-model="functions">
						<ul class="layer-ul">
						    <li><Checkbox label="compress">是否采用压缩资源</Checkbox></li>
						    <li><Checkbox label="mock">是否加载 mock.js 和 本地测试数据</Checkbox></li>
						</ul>
				    </CheckboxGroup>
				</div> -->
				<div class="auto-start">
						<div class="start-circle" @click="createProject">创建</div>
					</div>
			</div>
		</transition>
		
	</div>
</template>

<script>
	const $electron  = global.elRequire('electron');
	const $remote = $electron.remote;
	const $path = global.elRequire('path');
	const $fs = global.elRequire('fs');
	const $childProcess = global.elRequire('child_process');

	import { copy, startAutoServer } from 'GulpTask';
	import { bootFile } from 'bootTem';
	import { mapGetters } from 'vuex';
	import { execGulpTask, consoleLog } from 'mixin';
	import { formatRootPath } from 'helper';

	import AutoItem from '../../components/auto/AutoItem';

	export default {
		name: 'auto',
		data(){
			return {
				sep: $path.win32.sep,
				interValTime: '',
				console:'',
				folderPath: '',		//选择的项目地址
				config: {
					name:''
				},
				percent: 0,	//进度条
				status: 'active',	//进度条状态
				functions:{
					liveLoad: true
				},	//功能配置
				isShowLayer: false,	//创建弹窗
				isShowPublish: false, //发布弹窗
				projectList: [],
				defaultStartPath: '/pages/default/index.html',
				execChild:'',
				port:'9800'
			}
		},
		components:{
			AutoItem
		},
		computed:{
	        ...mapGetters([
	            'rootPath',
	            'rootPan'
	        ]),
	        defaultStart() {
	        	return '/' + this.config.name + this.defaultStartPath;
	        }
	    },
	    mixins: [execGulpTask,consoleLog],
		methods: {
			//添加目录
			addFolder() {
				if( this.interValTime ) {
					clearInterval(this.interValTime);
				}

				const dialog = $remote.dialog;
				
				dialog.showOpenDialog({
			        properties: ['openFile', 'openDirectory']
			    }, (path) => {
			    	try {
			    		this.$console(path[0]);

				        this.folderPath = path[0];
				        //进入这边肯定是有路径的，所以不做判断后才显示
			        	this.isShowLayer = true;
		           		this.percent = 0;
				        
			    	} catch(e) {
			    		console.log('没有选择');
			    		this.$console('no select');
			    	}
			    	
			    });
			},
			//关闭弹窗
			closeLayer() {
				//关闭的时候初始化
				this.folderPath = '';
				this.config.name = '';
				this.functions = ['browser'];

				this.isShowLayer = false;
			},
			//创建项目
			createProject() {
				if(this.config.name === '') {
					this.$console('No project name!')
					this.$Message.warning("请先填写项目名称");
                  	return ;
				}

				this.$console('Start creating');
				this.status = 'active';
				this.percent = 5;

				this.interValTime = setInterval(() => {
					if(this.percent < 40)
					this.percent += 1;
				}, 200);

				//执行创建项目
				this.copyProject(this.folderPath + this.sep + this.config.name, 'copy', copy, () => {
					
					//创建后修改boot.min.js的配置
					this.modifyFile(() => {

						//记录到localstorage
						this.storeRecord();

						//最终创建完成后的回调
						this.percent = 99;
						setTimeout(() => {
							this.isShowLayer = false;

							this.$console('Start liveLoad...')
							if(this.functions.liveLoad) {
								this.startLiveLoad(this.projectList[this.projectList.length-1]);
							}
						},200);
					});
					
				});
			},
			//更新boot.min.js的配置
			modifyFile(callback) {
				//boot.min.js配置文件的地址
				const bootPath =`${this.folderPath + this.sep + this.config.name + this.sep}js${this.sep}boot${this.sep}boot.min.js`;

				this.$console('Start updating… ');
				this.$console(bootPath);
				
				this.percent = 50;

				$fs.writeFile(bootPath, 
					bootFile({
						basePath: this.config.name
					}), (err) => {
						this.percent = 85;
				        if(err) {
				        	this.$console("Write in boot.min.js  falid!");
				        	this.status = 'wrong';
				        } else {
				        	if(typeof callback) {
				        		callback();
				        	}
				        	this.$console('Congratulations on your success!');

				        }
				    });
			},
			//存储localstorage
			storeRecord() {
				const projectPath = this.folderPath + this.sep + this.config.name;
                const folderName = $path.win32.basename(projectPath);

                this.projectList.push({
                    id: this.projectList.length,
                    name: folderName,
                    folderPath: this.folderPath,
                    projectPath: projectPath,
                    defaultStart: this.defaultStart,
                    isActive: false,
                    isStart: false
                });

                localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));
			},
			//启动服务器
			startLiveLoad(item) {
				console.log(item);
				if(item.isActive) {
					//关闭
					const execClose = `taskkill /pid ${item.execChild.pid} -t -f`;

	                $childProcess.exec(execClose, () => {
	                	this.$console(`${item.folderPath} liveLoad has closed!`);
	                });

	                item.isActive = false;
					
				} else {
					try {
                      	const folderPath = formatRootPath(item.folderPath);  //打开目录地址

                      	const projectPath = formatRootPath(item.projectPath);

                      	const folderName = `task_${$path.win32.basename(item.folderPath)}`;  //name

                      	const files = `['${projectPath}/pages/**']`;
	
                      	const task = startAutoServer(folderName, folderPath, files, this.port, item.defaultStart);

                      	$fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  () => {
	
                      	    const taskCmd = `gulp ${folderName}`;
                      	    const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;
	
                      	    item.execChild = $childProcess.exec(execStart, (error, stdout, stderr) => {
                      	    	if (error) {
								    this.$console(`exec error: ${error}`);
								    return;
								}
                      	    	this.$console('LiveLoad started!');
                      	    });

                      	    item.isActive = true;
	
                      	});

	                } catch(e) {
	                    console.log(e);
	                }
				}
			},
			//初始化列表数据
          	initData() {
              	this.projectList  = localStorage['auto_project_collection'] ? JSON.parse(localStorage['auto_project_collection']) : [];
          	}

		},
		mounted() {
			this.initData();
		}
	}
</script>

<style scoped lang="scss" src="../../assets/style/auto/auto.scss"></style>