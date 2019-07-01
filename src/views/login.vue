<style lang="less">
@import './login.less';
</style>

<template>
	<div class="login">
		<div class="login-con">
			<Card :bordered="false">
				<p slot="title">
					<Icon type="log-in"></Icon>欢迎登录
				</p>
				<div class="form-con">
					<Form ref="loginForm" :model="form" :rules="rules">
						<FormItem>
							<Button @click="handleSubmit" type="primary" long>登录</Button>
							<Button @click="handleSubmitTest" type="primary" long>测试登录</Button>
							<a
								href="https://api.weibo.com/oauth2/authorize?client_id=1078042542&redirect_uri=https://gunxueqiu.site/api/auth/weibo/callback"
							>
								<img
									src="http://timg.sjs.sinajs.cn/t4/appstyle/widget/images/loginButton/loginButton_24.png"
								/>
							</a>
						</FormItem>
					</Form>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
// import Cookies from 'js-cookie'
import { loginTest, queryUserInfo } from '../service/getData'
export default {
    data () {
        return {
            form: {
                userName: 'iview_admin',
                password: ''
            }
        }
    },
    methods: {
        async handleSubmit () {
            const data = await queryUserInfo()
            const retData = data.data
            if (retData && retData.code === 1) {
                const userInfo = retData.data
                this.$store.commit('login', userInfo)
                this.$router.push({
                    name: 'home_index'
                })
            }
        },
        async handleSubmitTest () {
            const userInfo = await loginTest()
            if (userInfo.data.code === 1) {
                this.$router.push({
                    name: 'home_index'
                })
            }
        }
    }
}
</script>

<style>
</style>
