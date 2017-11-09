<template>
	<div class="config">
		<Form :model="formItem"  label-position="top">
	        <FormItem label="默认端口（若冲突会自动+1）">
	            <Input v-model="defaultConfig.port" placeholder="9800"></Input>
	        </FormItem>
	        <FormItem label="默认启动页路径">
	            <Input v-model="defaultConfig.startPath" placeholder=""></Input>
	        </FormItem>
	        <FormItem label="默认发布后缀">
	            <Input v-model="defaultConfig.outName" placeholder=""></Input>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="save">保存</Button>
	            <Button type="ghost" style="margin-left: 8px" @click="back">返回</Button>
	        </FormItem>
	    </Form>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';

	export default {
		data() {
			return {
				formItem: {

				},
				config: {
					port: '9800',	//端口
					startPath: '/pages/default/index.html',	//默认启动页
					outName: '-dist'	//默认输出后缀
				}
			}
		},
		computed:{
	        ...mapGetters([
	            'defaultConfig'
	        ])
	    },
		methods: {
			save() {
				this.$store.dispatch('saveConfig', this.defaultConfig);

				this.$router.push({name: 'home'});
			},
			back() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style scoped lang="scss" src="../../assets/style/config/config.scss"></style>
