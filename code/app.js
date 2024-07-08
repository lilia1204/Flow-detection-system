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
    appid_car:'wDLxNw7drrZ33zcJ5zITevnx',
    secret_key_car:'MO0t8uiU9v0zRAwjx4uxxLYvOCW8fbEX',
    appid_peo:'VO5MFRzq5aq6EmrLHTpD0dJZ',
    secret_key_peo:'LBnFCV1KqGncWHCdgXJDitWiP6HDJlY6',
    car_lev:[1,10,12],
    peo_lev:[5,8,10],  
  }
})
