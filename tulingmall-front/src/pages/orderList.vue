<template>
  <div class="order-list">
    <order-header style="width:100%">
      <template v-slot:tip>
        <span style="font-size: 16px;color: #333333;font-weight: bold;">{{name}}</span>
        <span>余额:</span><span class="money"> {{balance}} </span>    &nbsp;&nbsp;|
        <span>今日盈亏:</span><span class="money">{{todayProfit}}</span>
      </template>
    </order-header>

    <div class="wrapper">
      <div class="container">
        <div class="order-box">
          <loading v-if="loading"></loading>

          <div class="order" v-for="(order,index) in list" :key="index">
            <div class="order-title">
              <div class="item-info fl">
                冠军和:<span class="money">{{order.number}}</span>
                <span></span>
                空期:<span class="money">{{order.clearNumber}}</span>
                <span>|</span>
              </div>
              <div class="item-money fr">
                <span>成本：</span>
                <span class="money">{{order.cost}}</span>
                <span>元</span>
                <span> | </span>
                <span>金额：</span>
                <span class="money" >{{order.tcUserBet.price || 0}}</span>
                <span>元</span>
              </div>
              
            </div>

          </div>
          <div class="load-more">
              <el-button type="primary" :key="1" @click="handleCycle(1)" v-if="cycled == 0">开启循环</el-button>
              <el-button type="primary" :key="2"  @click="handleCycle(0)" v-else-if="cycled == 1">关闭循环</el-button>
          </div>
          <div class="scroll-more"
            v-infinite-scroll="scrollMore"
            infinite-scroll-disabled="true"
            infinite-scroll-distance="410"
            v-if="false"
          >
            <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
          </div>
          <no-data v-if="!loading && list.length==0"></no-data>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import OrderHeader from './../components/OrderHeader'
  import Loading from './../components/Loading'
  import NoData from './../components/NoData'
  import { Pagination,Button } from 'element-ui'
  import infiniteScroll from 'vue-infinite-scroll'
  import {getCookie} from '@/util/support';
  import Qs from 'qs'
  export default{
    name:'order-list',
    components:{
      OrderHeader,
      Loading,
      NoData,
      [Pagination.name]:Pagination,
      [Button.name]:Button
    },
    directives: {
      infiniteScroll
    },
    data(){
      return {
        balance:0,
        todayProfit:0,
        menuId:this.$route.query.menuId,
        name:this.$route.query.name,
        cycled:this.$route.query.cycled,
        loading:false,
        list:[],
        pageSize:10,
        pageNum:1,
        total:0,
        showNextPage:true,//加载更多：是否显示按钮
        busy:false,//滚动加载，是否触发
        lastNumber:"",
      }
    },
    mounted(){
      this.getOrderList();
      this.remoteBalance();
      this.remoteReport();
      this.timer = setInterval(this.getOrderList, 15000);
      this.timer = setInterval(this.remoteBalance, 300000);
      this.timer = setInterval(this.remoteReport, 300000);
    },
    methods:{
      getOrderList(){
        this.loading = true;
        this.busy = true;
        this.axios.post('/menu/number/list',Qs.stringify({
            menuId:this.menuId,
            pageSize:20,
            pageNum:this.pageNum
           
        }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
          this.loading = false;
          this.list = res;
          this.total = res.total;
          this.showNextPage = res.hasNextPage;
          this.busy = false;
        }).catch(()=>{
          this.loading = false;
        })
      },
      toMenu(){
        this.$router.push({
          path:'/menu/list'
        })
      },
      getBalance(){
            this.loading = true;
            this.busy = true;
            this.axios.post('/menu/balance',Qs.stringify({
                menuId:1,
            }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
              this.balance = res.balance;
              this.todayProfit = res.todayProfit;
            }).catch((e)=>{
              if(e.code == 401){
                this.$router.push('/login');
              }
            })
          },
      handleCycle(value){
        this.axios.post('/menu/handleCycle',Qs.stringify({
            menuId:this.menuId,
            cycleValue:value,
        }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(()=>{
          this.cycled = value;
          window.console.info(this.cycled);
        }).catch(()=>{
          this.loading = false;
        })
      },
      remoteBalance(){
          var data = {};
          var remoteToken= getCookie("remoteToken");
          window.console.info("remoteToken:"+remoteToken);
          this.axios.post('/member/member/balance',
              data
              ,{headers: {
                  'Content-Type':'application/json',
                  'Origin':'https://tc78901.com',
                  'Locale':'zh_CN',
                  'Connection':'keep-alive',
                  'Authorization':'Bearer ' + remoteToken,
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
                  'Cookie':'i18n_redirected=zh-CN; _pk_id.59.5587=5bf6917bb01c82b9.1622732455.; _pk_ses.59.5587=1; _tianyin_token='+remoteToken,

              }}).then((res)=>{
                this.balance = res.balance;
              }).catch(()=>{
                this.loading = false;
              })
        },
        remoteReport(){
            var data = {};
            data.startTime = this.formatStartDate();
            data.endTime = this.formatDate();

            var remoteToken= getCookie("remoteToken");
            window.console.info("remoteToken:"+remoteToken);
            this.axios.post('/lottery/api/game-record/user-settle-report/get',
                data
                ,{headers: {
                    'Content-Type':'application/json',
                    'Origin':'https://tc78901.com',
                    'Locale':'zh_CN',
                    'Connection':'keep-alive',
                    'Authorization':'Bearer ' + remoteToken,
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
                    'Cookie':'i18n_redirected=zh-CN; _pk_id.59.5587=5bf6917bb01c82b9.1622732455.; _pk_ses.59.5587=1; _tianyin_token='+remoteToken,

                }}).then((res)=>{

                  for(var n=0;n<res.lottery.length;n++){
                      this.todayProfit = this.todayProfit + res.lottery[n].winLoss;
                  }
                }).catch(()=>{
                  this.loading = false;
                })
          },
        formatDate() {
          var date = new Date();
          var YY = date.getFullYear() + '/';
          var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
          var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
          var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
          var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
          return YY + MM + DD +" "+hh + mm + ss;
        },
        formatStartDate() {
            var date = new Date();
            var YY = date.getFullYear() + '/';
            var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
            var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            return YY + MM + DD +" 00:00:00";
          },
      goPay(orderNo){
        // 三种路由跳转方式
        // this.$router.push('/order/pay')
        /*this.$router.push({
          name:'order-pay',
          query:{
            orderNo
          }
        })*/
        this.$router.push({
          path:'/order/pay',
          query:{
            orderNo
          }
        })
      },
      // 第一种方法：分页器
      handleChange(pageNum){
        this.pageNum = pageNum;
        this.getOrderList();
      },
      // 第二种方法：加载更多按钮
      loadMore(){
        this.pageNum++;
        this.getOrderList();
      },
      // 第三种方法：滚动加载，通过npm插件实现
      scrollMore(){
        this.busy = true;
        setTimeout(()=>{
          this.pageNum++;
          this.getList();
        },500);
      },
      // 专门给scrollMore使用
      getList(){
        this.loading = true;
        this.axios.get('/orders',{
          params:{
            pageSize:10,
            pageNum:this.pageNum
          }
        }).then((res)=>{
          this.list = this.list.concat(res.list);
          this.loading = false;
          if(res.hasNextPage){
            this.busy=false;
          }else{
            this.busy=true;
          }
        });
      },
    }
  }
</script>
<style lang="scss">
  @import './../assets/scss/config.scss';
  @import './../assets/scss/mixin.scss';
  .order-list{
    .wrapper{
      background-color:$colorJ;
      padding-top:33px;
      padding-bottom:110px;
      .order-box{
        .order{
          @include border();
          background-color:$colorG;
          margin-bottom:1px;
          &:last-child{
            margin-bottom:0;
          }
          .order-title{
            @include height(40px);
            background-color:$colorK;
            padding:0 8px;
            font-size:9px;
            color:$colorC;
            .item-info{
              span{
                margin:0 1px;
              }
            }
            .money{
              font-size:16px;
              color:$colorB;
            }
          }
          .order-content{
            padding:0 43px;
            .good-box{
              width:88%;
              .good-list{
                display: flex;
                align-items: center;
                height:145px;
                .good-img{
                  width:112px;
                  img{
                    width:100%;
                  }
                }
                .good-name{
                  font-size:20px;
                  color:$colorB;
                }
              }
            }
            .good-state{
              @include height(145px);
              font-size: 20px;
              color:$colorA;
              a{
                color:$colorA;
              }
            }
          }
        }
        .pagination{
          text-align:right;
        }
        .el-pagination.is-background .el-pager li:not(.disabled).active{
          background-color: #FF6600;
        }
        .el-button--primary{
          background-color: #FF6600;
          border-color: #FF6600;
        }
        .load-more,.scroll-more{
          text-align:center;
        }
      }
    }
  }
</style>