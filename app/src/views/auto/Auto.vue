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
		<auto-item></auto-item>

		<!-- 创建配置弹出层 -->
		<transition name="fade" mode="out-in">
		  	<div class="layer" v-if="isShowLayer">
		  		<Progress :percent="percent" hide-info :status="status" :stroke-width="2" class="process"></Progress>
				<Icon type="close-round" class="close" @click.native="closeLayer"></Icon>
				<h5>项目名称</h5>
				<div class="layer-box">
					<input type="text" v-model="config.name" autofocus class="work-name" placeholder=" 如：myProject" />
				</div>
				<h5>工作区路径</h5>
				<div class="layer-box">
					<div class="work-path">{{folderPath}}</div>
				</div>
				<h5>功能</h5>
				<div class="layer-box">
					<CheckboxGroup v-model="functions">
						<ul class="layer-ul">
						    <li><Checkbox label="browser">开启 LiveReload 浏览器自动刷新 (默认开启)</Checkbox></li>
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

	import { copy } from 'GulpTask';
	import { bootFile } from 'bootTem';
	import { mapGetters } from 'vuex';
	import { execGulpTask, consoleLog } from 'mixin';

	import AutoItem from '../../components/auto/AutoItem';

	export default {
		name: 'auto',
		data(){
			return {
				interValTime: '',
				console:'',
				folderPath: '项目地址路径',
				config: {
					name:''
				},
				percent: 0,	//进度条
				status: 'active',	//进度条状态
				functions:['browser'],	//功能配置
				isShowLayer: false,	//创建弹窗
				isShowPublish: false //发布弹窗
			}
		},
		components:{
			AutoItem
		},
		computed:{
	        ...mapGetters([
	            'rootPath',
	            'rootPan'
	        ])
	    },
	    mixins: [execGulpTask,consoleLog],
		methods: {
			//添加目录
			addFolder() {
				if( this.interValTime ){
					clearInterval(this.interValTime);
				}

				const dialog = $remote.dialog;
				
				dialog.showOpenDialog({
			        // filters: [
			        //     {name: 'e-config', extensions: ['json']}
			        // ]
			        properties: ['openFile', 'openDirectory']
			    }, (path)=> {
			    	try {
			    		console.log(1)
			    		this.$console(path[0])
				        this.folderPath = path[0];
				        //this.folderPath = $path.parse(path[0]).dir;

			            //let config = $fs.readFileSync(path[0], "utf-8");

			           	//config = JSON.parse(config);

			           	//this.config = config || {};

			           	this.isShowLayer = true;
			           	this.percent = 0;
			    	} catch(e) {
			    		console.log('没有选择');
			    		this.$console('no select');
			    	}
			    	
			    });
			},
			closeLayer() {
				this.isShowLayer = false;
			},
			createProject() {
				if(this.folderPath === '项目地址路径') {
					this.$Message.warning("请先选择项目地址");
                  	return ;
				}
				this.$console('Start creating');
				this.status = 'active';
				this.percent = 5;

				this.interValTime = setInterval(()=>{
					if(this.percent < 40)
					this.percent += 1;
				}, 200)
				this.copyProject(this.folderPath +'/'+ this.config.name, 'copy', copy, ()=>{
					
					this.modifyFile(()=>{
						this.percent = 99;
						setTimeout(()=>{
							this.isShowLayer = false;
						},200);
					})
					
				});
			},
			//更新boot.min.js的配置
			modifyFile(callback) {
				this.$console('Start updating…')
				this.$console(this.folderPath +'/'+ this.config.name+ '/js/boot/boot.min.js');
				
				this.percent = 50;

				$fs.writeFile(this.folderPath +'/'+ this.config.name + '/js/boot/boot.min.js', 
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
				        	this.$console('Update boots.min.js success!');
				        	this.$console('Congratulations on your success!');

				        }
				    });
			}
		},
		mounted() {
		}
	}
</script>

<style scoped lang="scss" src="../../assets/style/auto/auto.scss"></style>