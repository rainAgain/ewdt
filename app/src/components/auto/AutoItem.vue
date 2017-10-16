<template>
	<div class="auto-item">
		<div class="item-folder">
            <Icon class="file-folder" type="folder"></Icon>
        </div>
        <div class="item-file">
            <p class="title">item.name</p>
            <p class="path">item.folderPath</p>
        </div>

        <div class="item-operation">
            <i-switch class="switch" color="#f00" size="small" @on-change="start(item)"></i-switch>
            
            <Icon class="operation-btn" title="刷新" type="ios-refresh-outline" @click.native="refresh(item)"></Icon>

            <Icon class="operation-btn" type="ios-trash-outline" title="删除" @click.native="deleteItem(item)"></Icon>
        </div>
	</div>
</template>

<script>
	export default {
		name: 'auto-item',
		data() {
			return {

			}
		},
		props:{
			item:{
		        type: Object
		    }
		},
		methods: {
			start() {

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