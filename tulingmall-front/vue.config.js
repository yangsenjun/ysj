module.exports = {
  devServer:{
    host:'localhost',
    port:8080,
    disableHostCheck: true,
    proxy:{
      '/api/lottery':{
        ws:true,
        // target:'http://localhost:8081',
        // target:'http://yangguo.natapp1.cc',
       //target:'http://localhost:8888',
       target:'https://tc78901.com/api/lottery',
        changeOrigin:true,
        pathRewrite:{
          '/api/lottery':''
        }
      },
      '/api/member/member':{
          ws:true,
          // target:'http://localhost:8081',
          // target:'http://yangguo.natapp1.cc',
         //target:'http://localhost:8888',
         target:'https://tc78901.com/api/member/member',
          changeOrigin:true,
          pathRewrite:{
            '/api/member/member':''
          }
        },
      '/api':{
          ws:false,
          // target:'http://localhost:8081',
          // target:'http://yangguo.natapp1.cc',
          // target:'http://zhizun99.net/api',
          target:'http://localhost:8888',
          changeOrigin:true,
          pathRewrite:{
            '/api':''
          }
        }
    }
  },
  // publicPath:'/app',
  // outputDir:'dist',
  // indexPath:'index2.html',
  // lintOnSave:false,
  productionSourceMap:true,
  chainWebpack:(config)=>{
    config.plugins.delete('prefetch');
  }
}