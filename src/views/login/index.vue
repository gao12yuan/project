<template>
<div class="login">
    <div  class="login-form">
      <div class="login-head">
      <img src="./logo_index.png" alt="">
      </div>
   <div  class="login-body">
     <el-form ref="form" :model="formInput" >
       <el-form-item >
        <el-input v-model="formInput.mobile"  placeholder="输入手机号码"></el-input>
      </el-form-item>
    <el-form-item >
      <el-col :span='12'>
       <el-input v-model="formInput.code" placeholder="输入验证码"></el-input>
      </el-col>
      <el-col :span='10'  :offset="2">
       <el-button  v-on:click="handelGet">获取验证码</el-button>
      </el-col>
     </el-form-item>
      <el-form-item>
      <el-button type="primary" class="btn" @click="handelLogin">登录</el-button>
     </el-form-item>
   </el-form>
   </div>
 </div>
</div>
</template>
<script>
import axios from 'axios'
import '@/vendor/gt'
export default {
  name: 'AppLogin',
  data () {
    return {
      formInput: {
        mobile: '18510507397',
        code: ''
      },
      captchaObj: null
    }
  },
  methods: {
    handelLogin () {
      axios({
        method: 'POST',
        url: 'https://mock.boxuegu.com/mock/434/v1_0/authorizations',
        data: this.formInput
      }).then(res => {
        this.$router.push({ name: 'home' })
      })
    },
    handelGet () {
      const { mobile } = this.formInput
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind'
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          captchaObj.onReady(function () {
            captchaObj.verify()
          }).onSuccess(function () {
            // console.log(captchaObj.getValidate())
            const { geetest_challenge: challenge, geetest_seccode: seccode, geetest_validate: validate } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              console.log(res.data)
            })
          }).onError(function () {
          })
        })
      })
    }
  }
}
</script>
<style  lang="less"  scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
   .login-form{
      background-color: #fff;
      padding: 30px;
      border-radius: 5%;
      text-align: center;
      .login-body{
         text-align: center;
         .btn {
              width: 100%;
           }
     }
        }
}
</style>
