<template>
  <div class="order-header">
    <div class="container clearfix">
      <div class="header-logo">
        <a href="/#/menu/list"></a>
      </div>
      <div class="title">
        <h2>{{title}}<slot name="tip"></slot></h2>
      </div>
      <div class="username">
        <span v-if="lastNumber != null" style="font-size:16px;" >最新结果:&nbsp;</span><span class="money" v-if="lastNumber != null" style="font-size:16px;">{{lastNumber}}&nbsp;&nbsp;</span>
        <a href="javascript:;" v-if="username != ''">&nbsp;|&nbsp;{{username}}</a>
        <a href="javascript:;" @click="logout" v-if="menuId == null">&nbsp;|&nbsp;退出&nbsp;&nbsp;</a>
      </div>
    </div>
  </div>
</template>
<script>
  import Qs from 'qs';
  import {mapState} from 'vuex'
  export default{
    name:'order-header',
    props:{
      title:String
    },
    data(){
      return {
        menuId:this.$route.query.menuId,
        lastNumber:null,
      }
    },
    computed:{
      ...mapState(['username'])
    },
    mounted(){
      if(this.menuId!=null){
          this.getMenuDetail();
          this.timer = setInterval(this.getMenuDetail, 15000);
      }
    },
    methods:{
      logout(){
          this.$cookie.set('token','');
          this.$cookie.set('username','');
          this.$router.push('/login');
      },
      getMenuDetail(){
          this.axios.post('/menu/detail',Qs.stringify({
              menuId:this.menuId
          }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
            this.lastNumber = res.lastNumber;
          }).catch(()=>{
            this.loading = false;
          })
        },
      bettingList(){
        this.axios.post('/remote/betting/list',Qs.stringify({
            menuId:1
        }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{

          for(var num = 0;num<res.length;num++){
                this.betting(res[num]);
          }
        }).catch(()=>{
          this.loading = false;
        })
      },
      betting(bettingInfo){
        this.axios.post('/lottery/api/lottery/betting',
        bettingInfo.data
        ,{headers: {
            'Content-Type':'application/json',
            'Origin':'https://tc78901.com',
            'Locale':'zh_CN',
            'Connection':'keep-alive',
            'Authorization':'Bearer ' + bettingInfo.token,
            'sec-ch-ua':'" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'Accept':'application/json, text/plain, */*',
            'sec-ch-ua-mobile':'?1',
            'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
            'loginDeviceType':'WAP',
            'Loading':'false',
            'Sec-Fetch-Site':'same-origin',
            'Sec-Fetch-Mode':'cors',
            'Sec-Fetch-Dest':'empty',
            'Referer':'https://tc78901.com/lotteryseries/lottery/speedboat/pk10/fs5focftbtpk10',
            'Cookie':'i18n_redirected=zh-CN; _pk_id.59.5587=5bf6917bb01c82b9.1622732455.; _pk_ses.59.5587=1; _tianyin_token='+bettingInfo.token,

            }}).then(()=>{
        }).catch(()=>{
          this.loading = false;
        })
      },
      bettingSuccess(menuId,issueNo){
        this.axios.post('/remote/betting',Qs.stringify({
            menuId:menuId,
            issueNo:issueNo
        }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(()=>{
        }).catch(()=>{
          this.loading = false;
        })
      },
    }

  }
</script>
<style lang="scss">
  .order-header{
    padding:30px 5;
    border-bottom:2px solid #FF6600;
    .header-logo{
      float:left;
    }
    .title,.username{
      display:inline-block;
      height:55px;
      line-height:55px;
    }
    .title{
      float:left;
      margin-left:5px;
      h2{
        font-size:16px;
        color:#333333;
      }
      span{
        font-size:14px;
        margin-left:2px;
        color:#999999;
        font-weight:200;
      }
    }
    .username{
      float:right;
      a{
        color:#666666;
        font-size:16px;
      }
    }
  }
</style>