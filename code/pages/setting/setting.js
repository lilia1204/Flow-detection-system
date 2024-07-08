const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    car_lev:app.car_lev,
    peo_lev:app.peo_lev,
    name:['轻度拥挤','中度拥挤','严重拥挤'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  carInput(e){
    const idx=e.currentTarget.dataset.index
    const value=e.detail.value
    let car_lev = this.data.car_lev;
    car_lev[idx] = value;
    this.setData({
      car_lev: car_lev
    });
  },

  peoInput(e){
    const idx=e.currentTarget.dataset.index
    const value=e.detail.value
    let peo_lev = this.data.peo_lev;
    car_lev[idx] = value;
    this.setData({
      peo_lev: peo_lev
    });
  },
  show(tip){
    wx.showModal({
      title: '提示',
      content: tip,
      showCancel:false,
      success: function (res) {
        console.log('用户点击确定')
      }
    })
  },
  judge(arr){
    arr.unshift(0)
    for(let i=1;i<4;i++){
      if(arr[i]<arr[i-1]) return false
    }
    return true
  },
  setCar(){
    const that=this
    if(this.judge(this.data.car_lev)){
      this.show('修改成功')
      app.car_lev=that.data.car_lev
    }else{
      this.show('修改失败!')
    }
  },
  setPeo(){
    if(this.judge(this.data.peo_lev)){
      this.show('修改成功')
      app.peo_lev=that.data.peo_lev
    }else{
      this.show('修改失败!')
    }
  }
})