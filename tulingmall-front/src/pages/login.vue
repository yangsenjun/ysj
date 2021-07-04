<template>
  <div class="login">
    <div class="container">
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="login-form">
          <h3>
            <span class="checked">帐号登录</span>
          </h3>
          <div class="input">
            <input type="text" placeholder="请输入帐号" v-model="username">
          </div>
          <div class="input">
            <input type="password" placeholder="请输入密码" v-model="password">
          </div>
          <div class="btn-box">
            <a href="javascript:;" class="btn" @click="remoteLogin">登录</a>
          </div>
          <div class="tips">
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-link">
      </div>
      <p class="copyright">Copyright ©2019 All Rights Reserved.</p>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import {setCookie} from '@/util/support';

import Qs from 'qs'

export default {
  Qs,
  name: 'login',
  data(){
    return {
      username:'',
      password:'',
      userId:'',
      remoteToken:'1234',
    }
  },
  methods:{
    login(username,password,remoteToken){
      this.axios.post(
        '/sso/login',
         Qs.stringify({
         username:username,
         password:password,
         remoteToken:remoteToken,
         }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{

            this.$cookie.set('token',res.tokenHead+' '+res.token,{expires:'1M'});
            this.$store.dispatch('saveToken',res.token);

           var tokenStr= decodeURIComponent(escape(window.atob(res.token.split('.')[1])));
           let username = JSON.parse(tokenStr).user_name;
           setCookie("username",username,120);
           this.saveUserName(username);

           this.$router.push({
             path:'/menu/list'
           });
      })
    },
    ...mapActions(['saveUserName']),
    register(){
      this.axios.post('/user/register',{
        username:'admin1',
        password:'admin1',
        email:'admin1@163.com'
      }).then(()=>{
        this.$message.success('注册成功');
      })
    },
    remoteLogin(){
      let { username,password } = this;
      var data = {};
      data.account = username;
      data.password = password;
      this.axios.post('/member/member/login',
       data,{headers: {
          'Content-Type':'application/json',
          'Origin':'https://tc78901.com',
          'Locale':'zh_CN',
          'Connection':'keep-alive',
          'sec-ch-ua':'" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'Accept':'application/json, text/plain, */*',
          'sec-ch-ua-mobile':'?1',
          'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
          'loginDeviceType':'WAP',
          'Loading':'false',
          'Sec-Fetch-Site':'same-origin',
          'Sec-Fetch-Mode':'cors',
          'Sec-Fetch-Dest':'empty',
          'Referer':'https://tc78901.com/loginRegister?mode=1',
      }}).then((res)=>{
        this.$cookie.set('remoteToken',res,{expires:'1M'});
        this.login(username,password,res)
      }).catch(()=>{
        this.loading = false;
        return null;
      })
    }
  }
}
</script>
<style lang="scss">
.login{
  &>.container{
    height:113px;
    img{
      width:auto;
      height:100%;
    }
  }
  .wrapper{
    background:url('/imgs/login-bg.jpg') no-repeat center;
    .container{
      height:576px;
      .login-form{
        box-sizing: border-box;
        padding-left: 31px;
        padding-right: 31px;
        width:100%;
        height:90%;
        background-color:#ffffff;
        position:absolute;
        bottom:29px;
        margin: 0 auto;
        position:relative;
        top:20px;
        h3{
          line-height:23px;
          font-size:24px;
          text-align:center;
          margin:40px auto 49px;
          .checked{
            color:#FF6600;
          }
          .sep-line{
            margin:0 32px;
          }
          padding-top:20px;
        }
        .input{
          display:inline-block;
          width:100%;
          height:60pm;
          border:1px solid #E5E5E5;
          margin-bottom:20px;
          input{
            width: 100%;
            height: 100%;
            border: none;
            padding: 18px;
          }
        }
        .btn{
          width:100%;
          line-height:50px;
          margin-top:10px;
          font-size:16px;
        }
        .tips{
          margin-top:14px;
          display:flex;
          justify-content:space-between;
          font-size:14px;
          cursor:pointer;
          .sms{
            color:#FF6600;
          }
          .reg{
            color:#999999;
            span{
              margin:0 7px;
            }
          }
        }
      }
    }
  }
  .footer{
    height:100px;
    padding-top:60px;
    color:#999999;
    font-size:16px;
    text-align:center;
    .footer-link{
      a{
        color:#999999;
        display:inline-block;
      }
      span{
        margin:0 10px;
      }
    }
    .copyright{
      margin-top:13px;
    }
  }
}
</style>