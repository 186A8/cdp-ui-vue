<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
      <el-row>
        <el-col :span="24">
          <div class="title-container">
            <h3 class="title">
              {{ $t('login.title') }}
            </h3>
            <LangSelect class="set-language" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.username"
              :placeholder="$t('login.username.placeholder')"
              name="username"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="password">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password.placeholder')"
              name="password"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-checkbox v-model="loginForm.rememberMe">
            {{ $t('login.rememberMe') }}
          </el-checkbox>
        </el-col>
        <el-col :span="20">
          <el-button
            :loading="loading"
            round
            type="primary"
            style="width:30%;margin-bottom:30px;float: right"
            @click.native.prevent="handleLogin"
          >
            {{ $t('login.logIn') }}
          </el-button>
        </el-col>
      </el-row>
      <SocialSign v-if="false" />
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
// import Register from './register'
export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        selectedRole: '',
        rememberMe: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      checked: false,
      loading: false,
      passwordType: 'password',
      // userRoles: [],
      redirect: undefined,
      NODE_ENV: process.env.NODE_ENV
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    mounted() {

    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch((reason) => {
            this.loading = false
            this.$notify({
              title: '登录失败',
              message: reason.message.error_description || reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import 'src/styles/variables.scss';

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $backgroundColor;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 480px;
      height: 350px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: auto;
      border-radius: 15px;
      background: white;
    }
    .el-form-item {
      background: #fff;
      border-radius: 5px;
      border: 1px solid $backgroundColor;
      height: 40px;
    }
    .el-select {
      width: 94%;
      height: 38px;
      .el-input--suffix {
        width: 100%;
      }
    }
    .el-checkbox {
      left: 35px;
    }
    .el-input {
      display: inline-block;
      height: 38px;
      width: 90%;
      &__inner {
        /*padding-right: 8px;*/
        /*padding-left: 8px;*/
        border: none;
      }
      /* input {
         background: transparent;
         border: none;
         -webkit-appearance: none;
         border-radius: 0px;
         padding: 12px 0px 12px 0px;
         color: #eee;
         height: 47px;
         &:-webkit-autofill {
           -webkit-box-shadow: 0 0 0px 1000px $backgroundColor inset !important;
           -webkit-text-fill-color: #fff !important;
         }
       }*/
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $textColor2;
      cursor: pointer;
      user-select: none;
    }
    .svg-container {
      padding: 0 0 0 10px;
      color: $backgroundColor;
      vertical-align: middle;
      width: 20px;
      display: inline-block;
      &_login {
        padding-left: 5px;
        font-size: 15px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $backgroundColor;
        margin: 0 auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: $backgroundColor;
        position: absolute;
        top: 5px;
        right: 0;
      }
    }
  }

</style>
