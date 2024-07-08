// pages/index/index.js
Page({
  // 转到车辆检测界面
  to_car(){
    wx.navigateTo({
      url: '../car/car',
    })
  },

  //转到人流量检测界面
  to_people(){
    wx.navigateTo({
      url: '../people/people',
    })
  },

  //转到设置阈值界面
  to_setting(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  }
})