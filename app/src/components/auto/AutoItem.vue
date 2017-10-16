<template>
	<div class="auto-item">
		<div class="item-folder">
            <Icon class="file-folder" type="folder"></Icon>
        </div>
        <div class="item-file">
            <p class="title">{{item.name}}</p>
            <p class="path">{{item.folderPath}}</p>
        </div>

        <div class="item-operation">
            <i-switch class="switch" color="#f00" v-model="item.isActive" size="small" @on-change="start(item)"></i-switch>

            <Icon class="operation-btn" type="ios-trash-outline" title="删除" @click.native="deleteItem(item)"></Icon>
        </div>
	</div>
</template>

<script>
	const $path = global.elRequire('path');
	const $fs = global.elRequire('fs');
	const $childProcess = global.elRequire('child_process');

	import { startAutoServer } from 'GulpTask';
	import { mapGetters } from 'vuex';
	import { consoleLog } from 'mixin';
	import { formatRootPath } from 'helper';

	export default {
		name: 'auto-item',
		data() {
			return {
				port: '9800'
			}
		},
		computed: {
	        ...mapGetters([
	            'rootPath',
	            'rootPan'
	        ])
	    },
		props: {
			item:{
		        type: Object
		    }
		},
		mixins: [consoleLog],
		methods: {
			start(item) {
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

                      const projectPath = formatRootPath(item.projectPath);	//项目地址

                      const folderName = `task_${$path.win32.basename(item.folderPath)}`;  //name

                      const files = `['${projectPath}/pages/**']`;

                      const task = startAutoServer(folderName, folderPath, files, this.port, item.defaultStart);

                      this.$console(`Start ${item.folderPath} liveLoad...`);

                      $fs.appendFile(`${this.rootPath}/gulpfile.js`, task,  () => {

                          const taskCmd = `gulp ${folderName}`;
                          const execStart = `${this.rootPan}: && cd ${this.rootPath} && ${taskCmd}`;

                          item.execChild = $childProcess.exec(execStart, () => {
                          	this.$console(`Start ${item.folderPath} liveLoad successed!`);
                          });
                      });

                      item.isActive = true;

	                } catch(e) {
	                    console.log(e);
	                }
				}
				
			},
			refresh() {

			},
			deleteItem() {

			}
		}
	}
</script>

<style lang="scss" scoped>
@import '../../assets/style/common/index.scss';
	.auto-item {
        padding-top: 10px;
        padding-bottom: 10px;
        border-left: 2px solid transparent;
        display: flex;
        justify-content: flex-start;
        
        cursor: pointer;

        &:hover,
        &.active {
            border-left: 2px solid #8bdb93;
            background-color: #eefaf0;            
        }

        .file-folder {
            width: 60px;
            font-size: 40px;
            color: #b0dcef;
            text-align: center;
        }

        .item-file {
            display: flex;
            flex-grow:1;
            justify-content: center;
            flex-direction: column;
        }

        .title,
        .path {
            line-height: 20px;
        }

        .title {
            font-size: 14px;
            color: #333;
        }

        .path {
            font-size: 12px;
            color: #666;
            @include clamp1;
        }

        .item-operation {
            width: 84px;
            padding-right: 10px;
            
            display:flex;
            justify-content:flex-start;
            align-items: center;

        }
        
        .switch {
            margin-right: 10px;
            
        }
        .operation-btn {
            width: 20px;
            height: 20px;
            padding-right: 10px;
            font-size: 18px;
            color: #b0dcef;
            
            &.active {
                color: #1ed75f;
            }
        }

        .ivu-switch-checked {
            border-color: #8bdb93;
            background-color: #8bdb93;
        }

    }
</style>