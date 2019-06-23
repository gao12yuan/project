<template>
  <div class="login">
    <div class="login-form">
      <div class="login-head">
        <img src="./logo_index.png"
             alt="">
      </div>
      <div class="login-body">
        <el-form :model="formInput"
                 :rules="rules"
                 ref="formInput">
          <el-form-item prop="mobile">
            <el-input v-model="formInput.mobile"
                      placeholder="输入手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-col :span='12'>
              <el-input v-model="formInput.code"
                        placeholder="输入验证码"></el-input>
            </el-col>
            <el-col :span='10'
                    :offset="2">
              <!-- <el-button  v-on:click="handelGet"  @click="codeCount">获取验证码</el-button> -->
              <el-button @click="handelGet"
                         :disabled="!!codeTimer || codeLoading">
                {{codeTimer? `剩余${countMsecod}秒` : '获取验证码'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="argee">
            <el-checkbox v-model="formInput.argee">
              <span> 阅读并同意协议 <a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="btn"
                       :loading="loginLoading"
                       @click="handelLogin">登录</el-button>
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
        mobile: '15611236858',
        code: '',
        argee: ''
      },
      loginLoading: false,
      captchaObj: null,
      countMsecod: '10',
      codeTimer: null,
      sendMobile: '',
      codeLoading: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度在6个字符', trigger: 'blur' }
        ],
        argee: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handelLogin () {
      this.$refs['formInput'].validate((valid) => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.formInput
      }).then(res => {
        console.log(res.data)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({ name: 'home' })
        this.loginLoading = false
      }).catch(() => {
        this.$message.error('登录失败')
        this.loginLoading = false
      })
    },
    handelGet () {
      // 检测手机号码十分有效
      this.$refs['formInput'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        if (this.captchaObj) {
          // 如果用户输入的手机号和之前初始化的验证码手机号不一致，就基于当前手机号码重新初始化
          // 否则，直接 verify 显示
          if (this.formInput.mobile !== this.sendMobile) {
            // 重新初始化之前，将原来的验证码插件 DOM 删除
            document.body.removeChild(document.querySelector('.geetest_panel'))
            // 手机号码发送改变，重新初始化验证码插件
            this.showGet()
          } else {
            this.captchaObj.verify()
          }
        } else {
          this.showGet()
        }
      })
    },
    showGet () {
      // const { mobile } = this.formInput
      // if (this.captchaObj) {
      //   return this.captchaObj.verify()
      // }
      this.codeLoading = true
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${this.formInput.mobile}`
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
          captchaObj.onReady(() => {
            this.sendMobile = this.formInput.mobile
            captchaObj.verify()
            // 验证码初始化好了，让 “获取验证码” 按钮可点击
            this.codeLoading = false
          }).onSuccess(() => {
            // console.log(captchaObj.getValidate())
            const { geetest_challenge: challenge, geetest_seccode: seccode, geetest_validate: validate } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${this.formInput.mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              console.log(res.data)
              this.codeCount()
            })
          })
        })
      })
    },
    codeCount () {
      this.codeTimer = window.setInterval(() => {
        this.countMsecod--
        if (this.countMsecod < 0) {
          this.countMsecod = 10
          window.clearInterval(this.codeTimer)
          this.codeTimer = null
        }
      }, 1000)
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
  background-image: url("./login_bg.jpg");
  .login-form {
    background-color: #fff;
    padding: 30px;
    border-radius: 5%;
    text-align: center;
    .login-body {
      text-align: center;
      .btn {
        width: 100%;
      }
    }
  }
}
</style>
