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
					<Form ref="loginForm" :model="form">
						<FormItem>
							<a @click="handleSubmit">
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
// // import Cookies from 'js-cookie'
// import { queryUserInfo } from '../service/getData'
import config from '../../build/config'
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
            const href = config.WEIBO_AUTH_URL
            window.location.href = href
        }
    },
    created () {}
}
</script>

<style>
</style>
