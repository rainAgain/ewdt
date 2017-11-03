<template>
	<div class="auto">
		<div class="btn-box">
			<Row>
		        <Col span="8" class="btns-col">
			        <Button type="ghost" class="btns" @click="addFolder">
						<Icon type="plus-round"></Icon> 选择目录
					</Button>
				</Col>
		        <Col span="8" class="btns-col">
		        	<Button type="ghost" class="btns" @click="release">
						<Icon title="配置" type="gear-b"></Icon> 发布
					</Button>
		        </Col>
		        <Col span="8" class="btns-col">
		        	<Button type="ghost" class="btns" :loading="isDeleting" @click="clearAll">
						{{deleteStr}}
					</Button>
		        </Col>
		    </Row>
		</div>
		
		<!-- 项目列表 -->
		<ul class="auto-item-list">
			<li v-for="(item,index) in projectList" :key="index"  @click="select(item,index)">
				<div class="auto-item" :class="{active : index == selected}">
					<div class="item-folder">
			            <Icon class="file-folder" type="folder"></Icon>
			        </div>
			        <div class="item-file">
			            <p class="title" >{{item.name}}</p>
			            <p class="path" :title="item.folderPath">{{item.folderPath}}</p>
			        </div>
			        <div class="item-operation">
						<div class="checkbox switch-item switch" title="启动/关闭服务器" @click="startLiveLoad(item, index)"> 
							<input type="checkbox" v-model="item.isActive" />
							<label></label>
						</div>
			            <Icon class="operation-btn" type="ios-trash-outline" title="删除" @click.native="deleteItem(item,index)"></Icon>
			        </div>
				</div>
			</li>
		</ul>

		<!-- 创建配置弹出层 -->
		<transition name="fade" mode="out-in">
		  	<div class="layer" v-if="isShowLayer">
		  		<Progress v-if="percent" :percent="percent" hide-info :status="status" :stroke-width="2" class="process"></Progress>
				<Icon type="close-round" class="close" @click.native="closeLayer"></Icon>
				<h5>项目名称 
                    <Tooltip content="建议用英文命名" placement="right">
                        <Icon type="information-circled" color="#f60"></Icon>
                    </Tooltip>
                </h5>
				<div class="layer-box">
					<input type="text" v-focus v-model.trim="config.name" class="work-name" placeholder="如：myProject" />
				</div>
				<h5>工作区路径</h5>
				<div class="layer-box">
					<div class="work-path">{{folderPath}}</div>
				</div>
				<h5>默认启动页</h5>
				<div class="layer-box">
					<input type="text" v-model="defaultStart" class="work-name" />
				</div>
				<h5>功能</h5>
				<div class="layer-box">
					<ul class="layer-ul">
					    <li>
					    	<Checkbox v-model="functions.liveLoad">开启 LiveReload 浏览器自动刷新 (默认开启)</Checkbox>
					    </li>
					</ul>
				</div>
				<div class="auto-start">
						<Button type="success" long @click.native="createProject">确认创建</Button>
					</div>
			</div>
		</transition>

		<!-- 发布配置弹出层 -->
		<transition name="fade" mode="out-in">
		  	<div class="layer" v-if="isShowRelease">
		  		<Progress v-if="relPercent" :percent="relPercent" hide-info :status="relStatus" :stroke-width="2" class="process"></Progress>
				<Icon type="close-round" class="close" @click.native="closeRelease"></Icon>
				<h5>生成项目名称({{this.choose.name + this.config.outName}})</h5>
				<div class="layer-box">
					<input type="text" v-model.trim="config.outName" autofocus class="work-name" placeholder="如：-dist(默认) || -v1.0(版本) || -101901(日期)" />
				</div>
				<h5>功能</h5>
				<div class="layer-box">
					<CheckboxGroup v-model="releaseFuns">
						<ul class="layer-ul">
							<li><Checkbox label="autoprefixer">开启 autoprefixer 解决方案</Checkbox></li>
							<!-- <li><Checkbox label="sprite">开启 整合压缩雪碧图 解决方案</Checkbox></li>
							<li><Checkbox label="base64">开启 转换图片为 base64 格式</Checkbox></li> -->
						    <li><Checkbox disabled label="minicss">开启 压缩 css 解决方案</Checkbox></li>
						    <li><Checkbox disabled label="uglifyJs">开启 混淆压缩 JS 解决方案</Checkbox></li>
						    <!-- <li><Checkbox label="hash">开启 文件版本去缓存解决方案</Checkbox></li> -->
						    <li></li>
						</ul>
				    </CheckboxGroup>
				</div>
				<div class="auto-start">
					<Button type="success" long @click.native="releaseProject">确认发布</Button>
				</div>
			</div>
		</transition>

		<!-- 确认删除 -->
		<Modal v-model="modalDelete" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除确认</span>
	        </p>
	        <div style="text-align:center">
	            <p>此项目删除后，将不再继续监听文件。</p>
	            <p>是否继续删除？</p>
	        </div>
	        <div slot="footer">
	            <Button type="info" size="large" @click="modalCancle">取消</Button>
	            <Button type="error" size="large"  :loading="modal_loading" @click="modalOk">删除</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	const $electron  = global.elRequire('electron');
    const $remote = $electron.remote;
    const $dialog = $remote.dialog;
	const $path = global.elRequire('path');
	const $fs = global.elRequire('fs');
	const $childProcess = global.elRequire('child_process');
	const $ipcRenderer = $electron.ipcRenderer;
	const $spawn = $childProcess.spawn;
    const $currentWindow = $remote.getCurrentWindow();
    const $kill = global.elRequire('tree-kill');


	import { uglifyBootJS, copy, startAutoServer } from 'GulpTask';
	import { bootFile } from 'bootTem';
	import { mapGetters } from 'vuex';
	import { execGulpTask, consoleLog } from 'mixin';
	import { formatRootPath } from 'helper';
    import { autoRelease } from 'GulpAuto';
    
    import { logFile } from 'logger';

	import AutoItem from '../../components/auto/AutoItem';

	export default {
		name: 'auto',
		data(){
			return {
				sep: $path.win32.sep,
				console: '',
				folderPath: '',		//选择的项目地址
				config: {
					name:'',
					outName:'-dist'
                },
                
				interValTime: null, //进度条定时器
				percent: 0,	//进度条
				status: 'active',	//进度条状态

                relInterValTime: null,
                relPercent: 0,
				relStatus: 'active',	//进度条状态
				
				functions: {
					liveLoad: true  //是否在创建的时候启动liveLoad
                },
                
                releaseFuns: ['autoprefixer','minicss','uglifyJs'],	//发布的功能配置
                
                isShowLayer: false,	//创建弹窗
                isHasShow: false,   //标记已经点击创建
                isShowRelease: false, //发布弹窗
                isHasRelease: false,    //标记

				projectList: [
                ],  //项目列表
                
                isDeleting: false,
                deleteStr: '删除全部',
				//defaultStartPath: '/pages/default/index.html',
				//execChild:'',
				//port:'9800',
				selected: null, //选中了列表中的哪一个
                choose: null,   //选中的哪个
                
				modalDelete: false, //是否显示删除弹窗
				modal_loading: false,   //是否显示删除的进度icon
				deleteObj: {
					item:'',
					index:''
				}   //删除的对象
			}
		},
		computed:{
	        ...mapGetters([
	            'rootPath',
	            'rootPan',
	            'defaultConfig'
	        ]),
	        defaultStart() {
	        	return '/' + this.config.name + this.defaultConfig.startPath;
	        }
	    },
        mixins: [execGulpTask,consoleLog],
        directives: {
            focus: {
                inserted(el) {
                    el.focus();
                }
            }
        },
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
				this.functions.liveLoad = true;
                this.isHasShow = false;
                this.isShowLayer = false;
                
			},
			//创建项目
			createProject() {

                if(this.isHasShow) {
                    return false;
                }
                this.isHasShow = true;

				if(this.config.name === '') {

                    this.$console('No project name!');
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
							this.closeLayer();

							this.selected = this.projectList.length-1;
							this.choose  = this.projectList[this.projectList.length-1];
							
						},200);
					});
					
				});
			},
			//更新boot.min.js的配置
			modifyFile(callback) {

				//boot.min.js配置文件的输出地址
				const outputPath =`${this.folderPath + this.sep + this.config.name + this.sep}js${this.sep}boot`;

				this.$console('Start updating… ');
				this.$console(outputPath);
				
				this.percent = 50;

                //boot.js原型目录的地址
                const bootRootPath = this.rootPath + '/project/prototype/js/boot/boot.js';
                
				bootFile({
					rootPath: bootRootPath,
					outputPath: outputPath + this.sep + 'boot.js',
					basePath: this.config.name
				},() => {
					this.percent = 85;

					//压缩boot.js 为boot.min,js
					this.commonHandle( outputPath, 'uglifyBoot', '', uglifyBootJS);

					if(typeof callback == 'function') {
		        		callback();
		        	}

		        	this.$console('Congratulations on your success!');
				})
			},
			//存储localstorage
			storeRecord() {
				const projectPath = this.folderPath + this.sep + this.config.name;
                const projectName = this.config.name;// $path.win32.basename(projectPath);

                this.$set(this.projectList, this.projectList.length, {
                    id: this.projectList.length,
                    name: projectName,
                    folderPath: this.folderPath,
                    projectPath: projectPath,
                    defaultStart: this.defaultStart,
                    isActive: false,
                    isStart: false
                })

                localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));

                
				if(this.functions.liveLoad) {
					this.startLiveLoad(this.projectList[this.projectList.length-1], this.projectList.length-1);
				}
            },
            //关闭服务器
            /**
             *@argument item 数据对象
             *@argument index 第几个
             *@argument isShow 是否显示提示信息，close方法中设为true，其他不需要传
             */
			closeServe(item, index, isShow) {

                $kill(item.execChild,'SIGKILL',(err) => {

                    if(index || index == 0 ) {
                        if(!isShow) {
                            this.$Message.info(`${item.name} 已关闭`);
                            this.$console(`${item.folderPath} liveLoad has closed!`);
                        }
                        
                        this.$set(this.projectList[index],'isActive',false);
                        localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));

                        // if(index == (this.projectList.length-1) && isShow) {
                        //     $currentWindow.close();
                        //     $currentWindow.removeAllListeners('close');
                        // }
                        
                    }
                });
			},
			//启动服务器
			startLiveLoad(item,index) {

                //如果已经启动则关闭，
                //否则开启
				if(item.isActive) {

					//关闭
					this.closeServe(item, index);
				} else {

					//启动
					try {
						let flag = false;
                      	const folderPath = formatRootPath(item.folderPath);  //打开目录地址
                        const projectPath = formatRootPath(item.projectPath);   //项目完整地址

                        const urlStr = item.projectPath.split($path.sep).join('_').replace(/:/g,'').toLowerCase();//路径分割名称
                      	const folderName = `task_autoserve_${urlStr}`;  //任务名称
                        const files = `['${projectPath}/pages/**']`;    //监听的文件目录
                          
                        //返回启动服务器的任务命令
                      	const task = startAutoServer(folderName, folderPath, files, this.defaultConfig.port, item.defaultStart);

                        //将task写入gulpfile.js
                      	$fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  () => {
                            
                            //执行命令
                      	    const taskCmd = `gulp ${folderName}`;
                      	    const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;

                      	    this.$console(execStart);
                            //logFile(`[wirte in gulpfile] ${execStart}`)

                      	    //这种写法，解决spawn不执行的问题
                      	    const args = [
	                      	    "/S",
	                      	    "/C",
	                      	    '"',
	                      	    execStart].concat('"');

							const loader = $spawn("cmd.exe", args, {
                                cwd: null, 
                                env: {
                                    ELECTRON_NO_ASAR: true,
                                    ELECTRON_RUN_AS_NODE: true
                                },
								windowsVerbatimArguments: true,
								detached: false
							});

                            //logFile(`[spawn exec]`)

                      	    loader.stdout.on('data', (data) => {
                                 //logFile(`[spawn stdout data] ${data}`)
                                //这边返回了多次，所以用一个flag标记一下只执行一次
                      	    	if(!flag) {
                                    //logFile(`[create Serve Success]`)
                      	    		flag = true;
                                    item.execChild = loader.pid;
                                    
		                      	    this.$set(this.projectList[index],'isActive',true);

			                		//需要更新localstorage的数据
									localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));
                                    
                                    //logFile(`[create Serve auto_project_collection] ${JSON.stringify(this.projectList)}`)

									this.$console('LiveLoad started!');
                      	    	}
                      	    	
                      	    });

                            loader.stderr.on('data', (data) => {
                               // logFile(`[spawn faild] ${data}`)
                            });

                      	    loader.on('exit', (code) => {
                                //logFile(`[loader exit] ${code}`);

                                loader.removeAllListeners()
							});

                      	   
                      	});

	                } catch(e) {
	                    console.log(e);
	                }
				}
			},
			//选中项目
			select(item, index) {
	            this.selected = index;
	            this.choose = item;
	        },
	        //删除项目
	        deleteItem(item, index) {
	        	this.modalDelete = true;

	        	this.deleteObj = {
	        		item: item,
	        		index: index
	        	}
	        },
	        //删除点击取消
	        modalCancle() {
	        	this.modalDelete = false;
	        },
	        //删除点击确认
	        modalOk() {
	        	this.modal_loading = true;
	        	const item = this.deleteObj.item;
	        	const index = this.deleteObj.index;

    			const projectList = this.projectList.concat();

                //删除本地存储中的数据
	        	const deleteItem = () => {

	        		this.$console(`${item.folderPath} liveLoad has removed!`);

	        		projectList.splice(index,1);

		        	localStorage.setItem('auto_project_collection', JSON.stringify(projectList));

		        	this.projectList = projectList;

		        	this.modal_loading = false;
                	this.modalDelete = false;
                	this.$Message.success('删除成功');
	        	}

                //如果是启动状态，则先关闭再删除本地数据
                //否则直接删除本地数据
	        	if(item.isActive) {

                    $kill(item.execChild,'SIGKILL',(err) => {

                       deleteItem();
                       $currentWindow.removeAllListeners('close');
                    })
	        	} else {
	        		deleteItem();
	        	}
                
	        },
	        //点击发布
	        release() {
	        	if(this.selected === null) {
	        		this.$Message.warning('请先选择要发布的项目！');
	        		return;
	        	}

	        	if( this.relInterValTime ) {
					clearInterval(this.relInterValTime);
				}

	        	this.relPercent = 0;
	        	
	        	this.config.outName = this.defaultConfig.outName;

	        	this.isShowRelease = true;
	        },
	        //确认发布
	        releaseProject() {
	        	if(!this.config.outName) {
	        		this.$Message.warning('请输入生成项目名称!');
	        		return;
                }
                
                if(this.isHasRelease) {
                    return false;
                }
                this.isHasRelease = true;

	        	this.relPercent = 5;

				this.$console('Start release!');

	        	const projectPath = formatRootPath(this.choose.projectPath);
                const folderPath = formatRootPath(this.choose.folderPath);
                const urlStr = this.choose.projectPath.split($path.sep).join('_').replace(/:/g,'').toLowerCase();//路径分割名称
                const folderName = `task_release_${urlStr}`;

	        	const task = autoRelease({
	        		folderName: folderName,
	        		folderPath: folderPath,
	        		dirName: this.choose.name,
	        		outDirName: this.choose.name + this.config.outName,
	        		siteDir: 'pages',
	        		tasks: this.releaseFuns
                });
                
                //写入gulpfile.js
	        	$fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  () => {

	        		this.relPercent = 15;

              	    const taskCmd = `gulp ${folderName}`;
              	    
              	    const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;
              	    
              	    this.$console(execStart);

              	    this.relInterValTime = setInterval(() => {
						if(this.relPercent < 60)
						this.relPercent += 1;
					}, 200);

              	    $childProcess.exec(execStart, (err) => {

              	    	if(err) {
              	    		console.log(err);
              	    		return;
              	    	}
            			
            			this.relPercent = 80

						const bootRootPath = this.rootPath + '/project/prototype/js/boot/boot.js';

                        const outputPath = `${this.choose.projectPath + this.config.outName + this.sep}js${this.sep}boot`;
                        
						bootFile({
							rootPath: bootRootPath,
							outputPath: outputPath + this.sep + 'boot.js',
							basePath: this.choose.name + this.config.outName,
							compress: 1
						},() => {

							this.relPercent = 99;
							
							//压缩boot.js 为boot.min,js
							this.commonHandle( outputPath, 'uglifyBootoRelease', '', uglifyBootJS);

							setTimeout(() => {
								this.$console('Release success!');
				        		this.closeRelease();
							},200);

						});

              	    });
              	});
	        },
	        closeRelease() {
                this.isHasRelease = false;
	        	this.isShowRelease = false;
	        },
			clearAll() {
                this.isDeleting = true;
                this.deleteStr = '删除中';

                const clearStorage = () => {
                    localStorage.removeItem("auto_project_collection");
                    localStorage.removeItem("auto_collection");
                    localStorage.removeItem("task_collection");
                    this.projectList = [];

                    this.isDeleting = false;
                    this.deleteStr = '删除全部';
                    //$currentWindow.reload();
                };

                if(this.projectList.length) {
                    this.projectList.forEach((item,index) => {
                        $kill(item.execChild,'SIGKILL',(err) => {

                            //不管是否启动都执行
                            if(index == (this.projectList.length-1)) {

                                $currentWindow.removeAllListeners('close');
                                clearStorage();
                            }
                        })
                    });
                } else {
                    clearStorage();
                }
                
			},
			//初始化列表数据
          	initData() {
          		this.projectList = localStorage['auto_project_collection'] ? JSON.parse(localStorage['auto_project_collection']) : [];
          	}

		},
		mounted() {
			
            this.initData();

            //当软件关闭时，结束启动的所有服务器
			// $currentWindow.on('close', (event) => {
               

            //     logFile(`[currentWindow close] ${this.projectList.length}`);
            //     if(this.projectList.length) {
                    
            //         this.projectList.forEach((item, index) => {

            //             //不管是否启动都执行
            //             item.isActive = false;

            //             logFile(`[currentWindow close forEach] ${item.isActive}`);    
            //             this.closeServe(item, index, true);
            //         });
            //     } else {
            //         $currentWindow.close();
            //         $currentWindow.removeAllListeners('close');
            //     }
				
            //     //在执行这边方法的时候，closeServe中的kill方法的貌似不会进去，故这边也重置一下
            //     //但是，那边的$currentWindow.remove 和close明明是执行了的，不然cmd会报错，这里不太理解
            //     //待深入和优化
            //     localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));

            //     //很重要！！！阻止程序的默认事件,不能放最前面
            //     event.preventDefault();
            // });

           

            let closeWindow = false

            window.addEventListener('beforeunload', evt => {
                if (closeWindow) return

                evt.returnValue = false

                setTimeout(() => {
                    let result = $dialog.showMessageBox({
                        message: '是否确认退出应用?',
                        buttons: ['是', '否']
                    })

                    if (result == 0) {
                        closeWindow = true

                        if(this.projectList.length) {
                    
                            this.projectList.forEach((item, index) => {

                                //不管是否启动都执行
                                item.isActive = false;
                                localStorage.setItem('auto_project_collection', JSON.stringify(this.projectList));
                                
                                this.closeServe(item, index, true);
                            });
                        }

                        $currentWindow.close();
                        $currentWindow.removeAllListeners('close');
                    }
                }, 16)
            })


		}
	}
</script>

<style scoped lang="scss" src="../../assets/style/auto/auto.scss"></style>