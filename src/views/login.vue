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
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleLocalSubmit" type="primary" long>登录</Button>
              <a @click="handleSubmit">
                <img
                  src="http://timg.sjs.sinajs.cn/t4/appstyle/widget/images/loginButton/loginButton_24.png"
                />
              </a>
              <a @click="handleQqSubmit">
                <img src="../images/qq.png" />
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
import { loginLocal } from '../service/getData'
import config from '../../build/config'
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        async handleSubmit () {
            const href = config.WEIBO_AUTH_URL
            window.location.href = href
        },
        async handleQqSubmit () {
            const href = config.QQ_AUTH_URL
            window.location.href = href
        },
        handleLocalSubmit () {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    const loginRes = await loginLocal({
                        username: this.form.userName,
                        pwd: this.form.password
                    })
                    if (loginRes.data.code < 0) {
                        this.$Message.error(loginRes.data.msg)
                        return
                    }

                    this.$router.push({
                        name: 'home_index'
                    })
                }
            })
        }
    },
    created () {}
}
</script>

<style>
</style>
