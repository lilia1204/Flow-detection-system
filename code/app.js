// app.js
App({
  onLaunch() {
   this.getAccessToken(this.globalData.appid_car,this.globalData.secret_key_car,true)
   this.getAccessToken(this.globalData.appid_peo,this.globalData.secret_key_peo,false)
  },
  getAccessToken(appid,secret_key,flag){
    const that=this
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+appid+'&client_secret='+secret_key,
      method: 'POST', //请求的方式
      data:{},
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      success:(res)=>{   
        console.log(res.data.access_token)
        if(flag){
          that.globalData.access_token_car=res.data.access_token
        }else{
          that.globalData.access_token_peo=res.data.access_token
        }
      },
      fail:(res)=>{
        console.log(res)
      }
    })
  },


  globalData: {
    access_token_car:'',
    access_token_peo:'',
    appid_car:'',//填写自己的人流量识别的百度智能云appid
    secret_key_car:'',//请填写自己的百度智能云密钥
    appid_peo:'',//填写自己的人流量识别的百度智能云appid
    secret_key_peo:'',//请填写自己的百度智能云密钥
    car_lev:[1,10,12],
    peo_lev:[5,8,10],  
  }
})
